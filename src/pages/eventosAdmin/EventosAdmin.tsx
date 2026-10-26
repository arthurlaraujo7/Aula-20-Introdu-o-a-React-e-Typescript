import { useCallback, useEffect, useState, type FormEvent } from "react";

import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";

import type { Evento, TipoEvento } from "../../types/api";
import { eventoService, tipoEventoService } from "../../services/eventPlusService";
import { getApiErrorMessage } from "../../services/api";

import bannerPadrao from "../../assets/banner-1.png";
import relogioIcon from "../../assets/icons/relogio.svg";
import "./EventosAdmin.css";

// ID fixo ou padrão da Instituição SENAI (se não houver endpoint exclusivo)
const INSTITUICAO_PADRAO_ID = "00000000-0000-0000-0000-000000000000";

function EventosAdmin() {
    const [eventos, setEventos] = useState<Evento[]>([]);
    const [tiposEvento, setTiposEvento] = useState<TipoEvento[]>([]);

    // Estados do Formulário
    const [nome, setNome] = useState("");
    const [dataEvento, setDataEvento] = useState("");
    const [descricao, setDescricao] = useState("");
    const [idTipoEvento, setIdTipoEvento] = useState("");
    const [idInstituicao, setIdInstituicao] = useState("");
    const [imagemUrl, setImagemUrl] = useState("");

    // Estados de Controle
    const [carregando, setCarregando] = useState(true);
    const [enviando, setEnviando] = useState(false);
    const [mensagem, setMensagem] = useState("");
    const [sucesso, setSucesso] = useState(false);

    const carregarDados = useCallback(async () => {
        setCarregando(true);
        setMensagem("");
        try {
            const [listaEventos, listaTipos] = await Promise.all([
                eventoService.listar(),
                tipoEventoService.listar()
            ]);
            setEventos(listaEventos);
            setTiposEvento(listaTipos);
        } catch (err) {
            setMensagem(getApiErrorMessage(err));
        } finally {
            setCarregando(false);
        }
    }, []);

    useEffect(() => {
        const timeout = window.setTimeout(() => void carregarDados(), 0);
        return () => window.clearTimeout(timeout);
    }, [carregarDados]);

    async function handleCadastrar(e: FormEvent) {
        e.preventDefault();

        if (!nome.trim() || !dataEvento || !idTipoEvento) {
            setMensagem("Preencha todos os campos obrigatórios.");
            setSucesso(false);
            return;
        }

        setEnviando(true);
        setMensagem("");

        try {
            await eventoService.cadastrar({
                nome: nome.trim(),
                dataEvento: new Date(dataEvento).toISOString(),
                descricao: descricao.trim(),
                imagemUrl: imagemUrl.trim() || undefined,
                idTipoEvento: idTipoEvento,
                idInstituicao: idInstituicao || INSTITUICAO_PADRAO_ID
            });

            setSucesso(true);
            setMensagem("Evento cadastrado com sucesso!");

            // Limpa o formulário
            setNome("");
            setDataEvento("");
            setDescricao("");
            setIdTipoEvento("");
            setIdInstituicao("");
            setImagemUrl("");

            // Recarrega a lista
            await carregarDados();
        } catch (err) {
            setSucesso(false);
            setMensagem(getApiErrorMessage(err));
        } finally {
            setEnviando(false);
        }
    }

    return (
        <>
            <Header />
            <main className="admin-evento-page">
                <div className="admin-evento-container">
                    {/* Título Principal */}
                    <h1 className="admin-section-titulo">ADMINISTRAÇÃO EVENTO</h1>

                    {/* Bloco de Cadastro (Ilustração + Formulário) */}
                    <div className="admin-cadastro-box">
                        <div className="admin-ilustracao-container">
                            {/* Ilustração estilo Figma */}
                            <svg viewBox="0 0 500 350" fill="none" className="admin-svg-ilustration">
                                <rect width="500" height="350" rx="40" fill="#F4F4F4" />
                                <circle cx="150" cy="140" r="40" fill="#B52146" />
                                <path d="M110 260 C110 200, 190 200, 190 260 Z" fill="#313852" />
                                <rect x="230" y="160" width="12" height="100" fill="#313852" />
                                <path d="M210 260 L260 260 L245 220 L225 220 Z" fill="#313852" />
                                <circle cx="340" cy="160" r="30" fill="#E2E2E2" />
                                <path d="M300 260 C300 210, 380 210, 380 260 Z" fill="#E2E2E2" />
                            </svg>
                        </div>

                        <form className="admin-form-evento" onSubmit={handleCadastrar}>
                            <div className="form-linha-dupla">
                                <div className="campo-grupo">
                                    <input
                                        type="text"
                                        placeholder="Nome"
                                        value={nome}
                                        onChange={(e) => setNome(e.target.value)}
                                        disabled={enviando}
                                        required
                                    />
                                </div>
                                <div className="campo-grupo campo-com-icone">
                                    <input
                                        type="datetime-local"
                                        value={dataEvento}
                                        onChange={(e) => setDataEvento(e.target.value)}
                                        disabled={enviando}
                                        required
                                    />
                                    <img src={relogioIcon} alt="Data e Hora" className="icone-input" />
                                </div>
                            </div>

                            <div className="campo-grupo">
                                <input
                                    type="text"
                                    placeholder="Descrição"
                                    value={descricao}
                                    onChange={(e) => setDescricao(e.target.value)}
                                    disabled={enviando}
                                />
                            </div>

                            <div className="form-linha-dupla">
                                <div className="campo-grupo">
                                    <select
                                        value={idTipoEvento}
                                        onChange={(e) => setIdTipoEvento(e.target.value)}
                                        disabled={enviando}
                                        required
                                    >
                                        <option value="" disabled hidden>
                                            Tipo de Evento
                                        </option>
                                        {tiposEvento.map((t) => {
                                            const id = t.idTipoEvento || (t as { id?: string }).id || "";
                                            const titulo = t.tituloTipoEvento || (t as { titulo?: string }).titulo || "Categoria";
                                            return (
                                                <option key={id} value={id}>
                                                    {titulo}
                                                </option>
                                            );
                                        })}
                                    </select>
                                </div>

                                <div className="campo-grupo">
                                    <select
                                        value={idInstituicao}
                                        onChange={(e) => setIdInstituicao(e.target.value)}
                                        disabled={enviando}
                                    >
                                        <option value="" disabled hidden>
                                            Instituição
                                        </option>
                                        <option value={INSTITUICAO_PADRAO_ID}>
                                            SENAI Informática
                                        </option>
                                    </select>
                                </div>
                            </div>

                            <div className="campo-grupo campo-com-icone">
                                <input
                                    type="url"
                                    placeholder="URL da Foto / Imagem"
                                    value={imagemUrl}
                                    onChange={(e) => setImagemUrl(e.target.value)}
                                    disabled={enviando}
                                />
                                <span className="icone-upload">⇪</span>
                            </div>

                            <button type="submit" className="btn-admin-cadastrar" disabled={enviando}>
                                {enviando ? "Cadastrando..." : "Cadastrar"}
                            </button>

                            {mensagem && (
                                <p className={`feedback-mensagem ${sucesso ? "sucesso" : "erro"}`}>
                                    {mensagem}
                                </p>
                            )}
                        </form>
                    </div>

                    {/* Seção de Listagem de Eventos */}
                    <h2 className="admin-section-subtitulo">EVENTOS</h2>

                    {carregando ? (
                        <p className="admin-status">Carregando lista de eventos...</p>
                    ) : eventos.length === 0 ? (
                        <p className="admin-status">Nenhum evento cadastrado.</p>
                    ) : (
                        <div className="admin-eventos-grid">
                            {eventos.map((evento) => {
                                const id = evento.idEvento || (evento as { id?: string }).id;
                                const categoriaNome =
                                    evento.idTipoEventoNavigation?.tituloTipoEvento ||
                                    (evento.idTipoEventoNavigation as { titulo?: string })?.titulo ||
                                    "Categoria";

                                return (
                                    <article className="card-evento-admin" key={id}>
                                        <div className="card-evento-banner">
                                            <img
                                                src={evento.imagemUrl || evento.urlImagem || bannerPadrao}
                                                alt={evento.nomeEvento}
                                            />
                                        </div>
                                        <div className="card-evento-body">
                                            <span className="card-evento-tag">{categoriaNome}</span>
                                            <h3 className="card-evento-titulo">{evento.nomeEvento}</h3>
                                            <p className="card-evento-descricao">
                                                {evento.descricao || "Sem descrição informada."}
                                            </p>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
}

export default EventosAdmin;