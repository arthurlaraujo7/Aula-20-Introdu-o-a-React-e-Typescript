import { useCallback, useEffect, useState, type FormEvent } from "react";

import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import Campo from "../../components/campo/Campo";
import Botao from "../../components/botao/Botao";
import ModalConfirmacao from "../../components/modalConfirmacao/ModalConfirmacao";

import type { TipoUsuario } from "../../types/api";
import { tipoUsuarioService } from "../../services/eventPlusService";
import { getApiErrorMessage } from "../../services/api";

import lapisIcon from "../../assets/icons/lapis.svg";
import lixeiraIcon from "../../assets/icons/lixeira.svg";
import ilustracaoImg from "../../assets/visao.png"; // Usa a ilustração cadastrada nos assets
import "./TipoUsuario.css";

function TipoUsuarioPage() {
    const [titulo, setTitulo] = useState("");
    const [tipos, setTipos] = useState<TipoUsuario[]>([]);
    const [idEmEdicao, setIdEmEdicao] = useState<string | null>(null);
    const [selecionado, setSelecionado] = useState<TipoUsuario | null>(null);
    const [carregando, setCarregando] = useState(true);
    const [enviando, setEnviando] = useState(false);
    const [mensagem, setMensagem] = useState("");

    const carregarTipos = useCallback(async () => {
        setCarregando(true);
        setMensagem("");
        try {
            const dados = await tipoUsuarioService.listar();
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
            await tipoUsuarioService.atualizar(idEmEdicao, tituloFormatado);
        } else {
            await tipoUsuarioService.cadastrar(tituloFormatado);
        }
        limpar();
        await carregarTipos();
    } catch (error) {
        setMensagem(getApiErrorMessage(error));
    } finally {
        setEnviando(false);
    }
}

    function editar(tipo: TipoUsuario) {
        if (!tipo.idTipoUsuario) return;
        setIdEmEdicao(tipo.idTipoUsuario);
        setTitulo(tipo.tituloTipoUsuario || (tipo as { titulo?: string }).titulo || "");
        setMensagem("");
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    async function excluir() {
        if (!selecionado?.idTipoUsuario) return;
        setEnviando(true);
        try {
            await tipoUsuarioService.excluir(selecionado.idTipoUsuario);
            if (idEmEdicao === selecionado.idTipoUsuario) limpar();
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
            <main className="tipo-usuario-page">
                {/* Seção Superior: Cadastro */}
                <section className="tipo-usuario-form-section">
                    <div className="tipo-usuario-form-container">
                        <h1 className="tipo-usuario-titulo">ADMINISTRAÇÃO TIPO DE USUÁRIOS</h1>

                        <div className="tipo-usuario-form-flex">
                            <div className="tipo-usuario-ilustracao">
                                <img src={ilustracaoImg} alt="Ilustração tipo de usuário" />
                            </div>

                            <form className="tipo-usuario-form" onSubmit={salvar}>
                                <div className="form-group">
                                    <Campo
                                        id="tipo-usuario-titulo"
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
                <section className="tipo-usuario-lista-section">
                    <div className="tipo-usuario-lista-container">
                        <h2 className="tipo-usuario-lista-titulo">LISTA TIPO DE USUÁRIOS</h2>

                        {carregando ? (
                            <p className="lista-status">Carregando tipos de usuário...</p>
                        ) : tipos.length === 0 ? (
                            <p className="lista-status">Nenhum tipo de usuário cadastrado.</p>
                        ) : (
                            <div className="tabela-container">
                                <table className="tabela-tipo-usuarios">
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
                                                key={tipo.idTipoUsuario}
                                                className={idEmEdicao === tipo.idTipoUsuario ? "linha-edicao" : ""}
                                            >
                                                <td>
                                                    {tipo.tituloTipoUsuario ||
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
                    titulo="Excluir tipo de usuário"
                    mensagem={
                        selecionado
                            ? `Deseja excluir "${
                                  selecionado.tituloTipoUsuario ||
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

export default TipoUsuarioPage;