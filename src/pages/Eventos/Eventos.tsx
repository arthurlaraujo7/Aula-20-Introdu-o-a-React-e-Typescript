import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";

import type { Evento, TipoEvento } from "../../types/api";
import { eventoService, tipoEventoService } from "../../services/eventPlusService";
import { getApiErrorMessage } from "../../services/api";

import bannerPadrao from "../../assets/banner-1.png";
import "./Eventos.css";

function Eventos() {
    const [eventos, setEventos] = useState<Evento[]>([]);
    const [tipos, setTipos] = useState<TipoEvento[]>([]);
    const [categoriaAtiva, setCategoriaAtiva] = useState<string>("Todos");
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    const carregarDados = useCallback(async () => {
        setCarregando(true);
        setErro("");
        try {
            const [eventosData, tiposData] = await Promise.all([
                eventoService.listar(),
                tipoEventoService.listar()
            ]);
            setEventos(eventosData);
            setTipos(tiposData);
        } catch (err) {
            setErro(getApiErrorMessage(err));
        } finally {
            setCarregando(false);
        }
    }, []);

    useEffect(() => {
        const timeout = window.setTimeout(() => void carregarDados(), 0);
        return () => window.clearTimeout(timeout);
    }, [carregarDados]);

    // Filtragem de eventos por categoria
    const eventosFiltrados = categoriaAtiva === "Todos"
        ? eventos
        : eventos.filter(e => {
            const tituloCat = e.idTipoEventoNavigation?.tituloTipoEvento || (e.idTipoEventoNavigation as { titulo?: string })?.titulo;
            return e.idTipoEvento === categoriaAtiva || tituloCat === categoriaAtiva;
        });

    return (
        <>
            <Header />
            <main className="catalogo-page">
                <div className="catalogo-container">
                    {/* Filtros por Categoria */}
                    <div className="catalogo-filtros">
                        <button
                            type="button"
                            className={`filtro-pill ${categoriaAtiva === "Todos" ? "ativo" : ""}`}
                            onClick={() => setCategoriaAtiva("Todos")}
                        >
                            Todos
                        </button>
                        {tipos.map((tipo) => {
                            const titulo = tipo.tituloTipoEvento || (tipo as { titulo?: string }).titulo || "Categoria";
                            const idOuTitulo = tipo.idTipoEvento || titulo;
                            return (
                                <button
                                    key={tipo.idTipoEvento || titulo}
                                    type="button"
                                    className={`filtro-pill ${categoriaAtiva === idOuTitulo ? "ativo" : ""}`}
                                    onClick={() => setCategoriaAtiva(idOuTitulo)}
                                >
                                    {titulo}
                                </button>
                            );
                        })}
                    </div>

                    {/* Mensagens de Estado */}
                    {carregando && <p className="catalogo-status">Carregando eventos...</p>}
                    {erro && <p className="catalogo-status erro">{erro}</p>}

                    {/* Grid de Eventos */}
                    {!carregando && !erro && (
                        eventosFiltrados.length === 0 ? (
                            <p className="catalogo-status">Nenhum evento encontrado nesta categoria.</p>
                        ) : (
                            <div className="catalogo-grid">
                                {eventosFiltrados.map((evento) => {
                                    const categoriaNome = evento.idTipoEventoNavigation?.tituloTipoEvento ||
                                        (evento.idTipoEventoNavigation as { titulo?: string })?.titulo ||
                                        "Categoria";

                                    return (
                                        <article className="card-evento" key={evento.idEvento}>
                                            <div className="card-evento-banner">
                                                <img
                                                    src={evento.urlImagem || bannerPadrao}
                                                    alt={evento.nomeEvento}
                                                />
                                            </div>
                                            <div className="card-evento-body">
                                                <span className="card-evento-tag">{categoriaNome}</span>
                                                <h3 className="card-evento-titulo">{evento.nomeEvento}</h3>
                                                <p className="card-evento-descricao">
                                                    {evento.descricao || "Sem descrição informada."}
                                                </p>
                                                <Link
                                                    to={`/detalhes-evento/${evento.idEvento || (evento as { id?: string }).id}`}
                                                    className="card-evento-link"
                                                >
                                                    Ver Evento
                                                </Link>
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>
                        )
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
}

export default Eventos;