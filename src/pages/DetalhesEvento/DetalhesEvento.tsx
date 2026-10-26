import { useCallback, useEffect, useState, type FormEvent } from "react";
import { useParams } from "react-router-dom";

import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";

import type { Comentario, Evento } from "../../types/api";
import { comentarioService, eventoService, presencaService } from "../../services/eventPlusService";
import { getApiErrorMessage } from "../../services/api";
import { useAuth } from "../../context/auth";

import relogioIcon from "../../assets/icons/relogio.svg";
import predioIcon from "../../assets/icons/predio.svg";
import filtroIcon from "../../assets/icons/filtro.svg";
import enviarIcon from "../../assets/icons/enviar.svg";
import bannerPadrao from "../../assets/banner-1.png";

import "./DetalhesEvento.css";

function DetalhesEvento() {
    const { id } = useParams<{ id: string }>();
    const { usuario } = useAuth();

    const [evento, setEvento] = useState<Evento | null>(null);
    const [comentarios, setComentarios] = useState<Comentario[]>([]);
    const [abaAtiva, setAbaAtiva] = useState<"sobre" | "comentarios">("sobre");
    const [novoComentario, setNovoComentario] = useState("");

    const [inscrito, setInscrito] = useState(false);
    const [idPresenca, setIdPresenca] = useState<string | null>(null);

    const [carregando, setCarregando] = useState(true);
    const [enviandoComentario, setEnviandoComentario] = useState(false);
    const [enviandoInscricao, setEnviandoInscricao] = useState(false);
    const [mensagem, setMensagem] = useState("");

    const carregarDetalhes = useCallback(async () => {
        if (!id) return;
        setCarregando(true);
        setMensagem("");
        try {
            const [eventoData, comentariosData] = await Promise.all([
                eventoService.buscar(id), // Utiliza .buscar()
                comentarioService.listarPorEvento(id)
            ]);
            setEvento(eventoData);
            setComentarios(comentariosData);

            // Verificar presença do usuário logado
            if (usuario?.idUsuario) {
                const presencas = await presencaService.listarPorUsuario(usuario.idUsuario); // Utiliza .listarPorUsuario()
                const minhaPresenca = presencas.find(p => p.idEvento === id);
                if (minhaPresenca) {
                    setInscrito(Boolean(minhaPresenca.situacao));
                    setIdPresenca(minhaPresenca.idPresenca || null);
                }
            }
        } catch (err) {
            setMensagem(getApiErrorMessage(err));
        } finally {
            setCarregando(false);
        }
    }, [id, usuario?.idUsuario]);

    useEffect(() => {
        const timeout = window.setTimeout(() => void carregarDetalhes(), 0);
        return () => window.clearTimeout(timeout);
    }, [carregarDetalhes]);

    async function toggleInscricao() {
        if (!id || !usuario?.idUsuario) {
            setMensagem("Faça login para se inscrever no evento.");
            return;
        }

        setEnviandoInscricao(true);
        setMensagem("");
        try {
            if (inscrito && idPresenca) {
                // Desinscrever: remove o registro de presença
                await presencaService.excluir(idPresenca);
                setInscrito(false);
                setIdPresenca(null);
            } else {
                // Inscrever: cadastra a nova presença
                const novaPresenca = await presencaService.cadastrar({
                    idUsuario: usuario.idUsuario,
                    idEvento: id,
                    situacao: true
                });
                setInscrito(true);
                setIdPresenca(novaPresenca.idPresenca || null);
            }
        } catch (err) {
            setMensagem(getApiErrorMessage(err));
        } finally {
            setEnviandoInscricao(false);
        }
    }

    async function enviarNovoComentario(e: FormEvent) {
        e.preventDefault();

        // 1. Verifica se o usuário está logado

        if(!usuario?.idUsuario) {
            setMensagem("Você precisa estar logado para enviar um comentário.");
            return;
        }


        if (!novoComentario.trim() || !id || !usuario?.idUsuario) return;

        setEnviandoComentario(true);
        setMensagem("");
        try {
            await comentarioService.cadastrar({
                descricao: novoComentario.trim(),
                idUsuario: usuario.idUsuario,
                idEvento: id
            });

            setNovoComentario("");

            //2 - Recarrega os comentários
            const atualizados = await comentarioService.listarPorEvento(id);
            setComentarios(atualizados);
        } catch (err) {
            setMensagem(getApiErrorMessage(err));
        } finally {
            setEnviandoComentario(false);
        }
    }

    if (carregando) {
        return (
            <>
                <Header />
                <main className="detalhes-page">
                    <p className="detalhes-status">Carregando detalhes do evento...</p>
                </main>
                <Footer />
            </>
        );
    }

    if (!evento) {
        return (
            <>
                <Header />
                <main className="detalhes-page">
                    <p className="detalhes-status erro">Evento não encontrado.</p>
                </main>
                <Footer />
            </>
        );
    }

    const dataFormatada = evento.dataEvento
        ? new Date(evento.dataEvento).toLocaleDateString("pt-BR", { day: "2-digit", month: "long" })
        : "Data não informada";

    const horaFormatada = evento.dataEvento
        ? new Date(evento.dataEvento).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
        : "";

    const nomeCategoria = evento.idTipoEventoNavigation?.tituloTipoEvento ||
        (evento.idTipoEventoNavigation as { titulo?: string })?.titulo ||
        "Geral";

    const nomeInstituicao = evento.idInstituicaoNavigation?.nomeFantasia || "Senai Cyber & IA";

    return (
        <>
            <Header />
            <main className="detalhes-page">
                <div className="detalhes-container">
                    {/* Banner do Evento */}
                    <div className="detalhes-banner">
                        <img
                            src={evento.imagemUrl || evento.urlImagem || bannerPadrao}
                            alt={evento.nomeEvento}
                        />
                    </div>

                    {/* Título */}
                    <h1 className="detalhes-titulo">{evento.nomeEvento}</h1>

                    {/* Conteúdo Principal */}
                    <div className="detalhes-content-grid">
                        {/* Coluna Esquerda: Abas e Informações */}
                        <div className="detalhes-col-esquerda">
                            <div className="detalhes-abas">
                                <button
                                    type="button"
                                    className={`aba-pill ${abaAtiva === "sobre" ? "ativa" : ""}`}
                                    onClick={() => setAbaAtiva("sobre")}
                                >
                                    Sobre o evento
                                </button>
                                <button
                                    type="button"
                                    className={`aba-pill ${abaAtiva === "comentarios" ? "ativa" : ""}`}
                                    onClick={() => setAbaAtiva("comentarios")}
                                >
                                    Comentários
                                </button>
                            </div>

                            {abaAtiva === "sobre" ? (
                                <div className="detalhes-descricao">
                                    <p>{evento.descricao || "Nenhuma descrição fornecida para este evento."}</p>
                                </div>
                            ) : (
                                <div className="detalhes-comentarios-secao">
                                    <form className="form-comentario" onSubmit={enviarNovoComentario}>
                                        <input
                                            type="text"
                                            placeholder="Comentar"
                                            value={novoComentario}
                                            onChange={(e) => setNovoComentario(e.target.value)}
                                            disabled={enviandoComentario}
                                        />
                                        <button
                                            type="submit"
                                            disabled={enviandoComentario || !novoComentario.trim()}
                                            title="Enviar comentário"
                                        >
                                            <img src={enviarIcon} alt="Enviar" />
                                        </button>
                                    </form>

                                    <div className="lista-comentarios">
                                        {comentarios.length === 0 ? (
                                            <p className="sem-comentarios">Seja o primeiro a comentar!</p>
                                        ) : (
                                            comentarios.map((c) => (
                                                <div key={c.idComentario} className="item-comentario">
                                                    <div className="comentario-header">
                                                        <strong>{c.idUsuarioNavigation?.nome || "Usuário"}</strong>
                                                        <span>
                                                            {c.dataComentario
                                                                ? new Date(c.dataComentario).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })
                                                                : ""}
                                                        </span>
                                                    </div>
                                                    <p>{c.descricao}</p>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}

                            {mensagem && <p className="mensagem-feedback">{mensagem}</p>}
                        </div>

                        {/* Coluna Direita: Informações e Inscrição */}
                        <div className="detalhes-col-direita">
                            <h2 className="info-titulo">INFORMAÇÕES PRINCIPAIS</h2>

                            <ul className="info-lista">
                                <li>
                                    <img src={relogioIcon} alt="Data e Hora" />
                                    <span>{dataFormatada} {horaFormatada ? `às ${horaFormatada}` : ""}</span>
                                </li>
                                <li>
                                    <img src={predioIcon} alt="Local" />
                                    <span>{nomeInstituicao}</span>
                                </li>
                                <li>
                                    <img src={filtroIcon} alt="Categoria" />
                                    <span>{nomeCategoria}</span>
                                </li>
                            </ul>

                            <button
                                type="button"
                                className={`btn-inscrever ${inscrito ? "inscrito" : ""}`}
                                onClick={() => void toggleInscricao()}
                                disabled={enviandoInscricao}
                            >
                                {enviandoInscricao
                                    ? "Aguarde..."
                                    : inscrito
                                        ? "Inscrito"
                                        : "Se-inscrever"}
                            </button>
                        </div>  
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}

export default DetalhesEvento;