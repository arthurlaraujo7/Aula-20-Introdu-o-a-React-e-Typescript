import { useCallback, useEffect, useState, type FormEvent } from "react";

import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import Campo from "../../components/campo/Campo";
import Botao from "../../components/botao/Botao";
import ModalConfirmacao from "../../components/modalConfirmacao/ModalConfirmacao";

import type { TipoEvento } from "../../types/api";
import { tipoEventoService } from "../../services/eventPlusService";
import { getApiErrorMessage } from "../../services/api";

import lapisIcon from "../../assets/icons/lapis.svg";
import lixeiraIcon from "../../assets/icons/lixeira.svg";
import ilustracaoImg from "../../assets/visao.png";
import "./TipoEvento.css";

function TipoEventoPage() {
    const [titulo, setTitulo] = useState("");
    const [tipos, setTipos] = useState<TipoEvento[]>([]);
    const [idEmEdicao, setIdEmEdicao] = useState<string | null>(null);
    const [selecionado, setSelecionado] = useState<TipoEvento | null>(null);
    const [carregando, setCarregando] = useState(true);
    const [enviando, setEnviando] = useState(false);
    const [mensagem, setMensagem] = useState("");

    const carregarTipos = useCallback(async () => {
        setCarregando(true);
        setMensagem("");
        try {
            const dados = await tipoEventoService.listar();
            setTipos(dados);
        } catch (error) {
            setMensagem(getApiErrorMessage(error));
        } finally {
            setCarregando(false);
        }
    }, []);

    useEffect(() => {
        const timeout = window.setTimeout(() => void carregarTipos(), 0);
        return () => window.clearTimeout(timeout);
    }, [carregarTipos]);

    function limpar() {
        setTitulo("");
        setIdEmEdicao(null);
        setMensagem("");
    }

    async function salvar(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!titulo.trim()) return;

        setEnviando(true);
        setMensagem("");
        try {
            const tituloFormatado = titulo.trim();

            if (idEmEdicao) {
                await tipoEventoService.atualizar(idEmEdicao, tituloFormatado);
            } else {
                await tipoEventoService.cadastrar(tituloFormatado);
            }
            limpar();
            await carregarTipos();
        } catch (error) {
            setMensagem(getApiErrorMessage(error));
        } finally {
            setEnviando(false);
        }
    }

    function editar(tipo: TipoEvento) {
        if (!tipo.idTipoEvento) return;
        setIdEmEdicao(tipo.idTipoEvento);
        setTitulo(tipo.tituloTipoEvento || (tipo as { titulo?: string }).titulo || "");
        setMensagem("");
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    async function excluir() {
        if (!selecionado?.idTipoEvento) return;
        setEnviando(true);
        try {
            await tipoEventoService.excluir(selecionado.idTipoEvento);
            if (idEmEdicao === selecionado.idTipoEvento) limpar();
            await carregarTipos();
        } catch (error) {
            setMensagem(getApiErrorMessage(error));
        } finally {
            setSelecionado(null);
            setEnviando(false);
        }
    }

    return (
        <>
            <Header />
            <main className="tipo-evento-page">
                {/* Seção Superior: Cadastro */}
                <section className="tipo-evento-form-section">
                    <div className="tipo-evento-form-container">
                        <h1 className="tipo-evento-titulo">ADMINISTRAÇÃO TIPO DE EVENTOS</h1>

                        <div className="tipo-evento-form-flex">
                            <div className="tipo-evento-ilustracao">
                                <img src={ilustracaoImg} alt="Ilustração tipo de evento" />
                            </div>

                            <form className="tipo-evento-form" onSubmit={salvar}>
                                <div className="form-group">
                                    <Campo
                                        id="tipo-evento-titulo"
                                        type="text"
                                        value={titulo}
                                        onChange={(e) => setTitulo(e.target.value)}
                                        placeholder="Título"
                                        maxLength={50}
                                        required
                                    />
                                </div>

                                <div className="form-botoes">
                                    <Botao
                                        texto={enviando ? "Salvando..." : idEmEdicao ? "Salvar" : "Cadastrar"}
                                        type="submit"
                                        disabled={enviando}
                                    />
                                    {idEmEdicao && (
                                        <button type="button" className="btn-cancelar" onClick={limpar}>
                                            Cancelar
                                        </button>
                                    )}
                                </div>

                                {mensagem && <p className="mensagem-feedback">{mensagem}</p>}
                            </form>
                        </div>
                    </div>
                </section>

                {/* Seção Inferior: Tabela com Fundo Vermelho */}
                <section className="tipo-evento-lista-section">
                    <div className="tipo-evento-lista-container">
                        <h2 className="tipo-evento-lista-titulo">LISTA TIPO DE EVENTOS</h2>

                        {carregando ? (
                            <p className="lista-status">Carregando tipos de eventos...</p>
                        ) : tipos.length === 0 ? (
                            <p className="lista-status">Nenhum tipo de evento cadastrado.</p>
                        ) : (
                            <div className="tabela-container">
                                <table className="tabela-tipo-eventos">
                                    <thead>
                                        <tr>
                                            <th>Título</th>
                                            <th className="col-acao">Editar</th>
                                            <th className="col-acao">Deletar</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tipos.map((tipo) => (
                                            <tr
                                                key={tipo.idTipoEvento}
                                                className={idEmEdicao === tipo.idTipoEvento ? "linha-edicao" : ""}
                                            >
                                                <td>
                                                    {tipo.tituloTipoEvento ||
                                                        (tipo as { titulo?: string }).titulo ||
                                                        "Sem título"}
                                                </td>
                                                <td className="col-acao">
                                                    <button
                                                        type="button"
                                                        className="btn-icone"
                                                        title="Editar tipo"
                                                        onClick={() => editar(tipo)}
                                                    >
                                                        <img src={lapisIcon} alt="Editar" />
                                                    </button>
                                                </td>
                                                <td className="col-acao">
                                                    <button
                                                        type="button"
                                                        className="btn-icone"
                                                        title="Excluir tipo"
                                                        onClick={() => setSelecionado(tipo)}
                                                    >
                                                        <img src={lixeiraIcon} alt="Deletar" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </section>

                <ModalConfirmacao
                    show={Boolean(selecionado)}
                    titulo="Excluir tipo de evento"
                    mensagem={
                        selecionado
                            ? `Deseja excluir "${
                                  selecionado.tituloTipoEvento ||
                                  (selecionado as { titulo?: string }).titulo ||
                                  ""
                              }"?`
                            : ""
                    }
                    textoConfirmar={enviando ? "Excluindo..." : "Excluir"}
                    textoCancelar="Cancelar"
                    onClose={() => setSelecionado(null)}
                    onConfirm={() => void excluir()}
                />
            </main>
            <Footer />
        </>
    );
}

export default TipoEventoPage;