import { useEffect, useState } from "react";

import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import CardEvento from "../../components/cardEvento/CardEvento";
import { eventoService } from "../../services/eventPlusService";
import type { Evento } from "../../types/api";

import "./Eventos.css";

function Eventos() {
    const [eventos, setEventos] = useState<Evento[]>([]);
    const [carregando, setCarregando] = useState<boolean>(true);

    useEffect(() => {
        async function carregarEventos() {
            try {
                const dados = await eventoService.listar();
                setEventos(dados);
            } catch (erro) {
                console.error("Erro ao carregar eventos da API:", erro);
            } finally {
                setCarregando(false);
            }
        }

        carregarEventos();
    }, []);

    return (
        <>
            <Header />

            <main className="eventos-main">
                <div className="eventos-container">
                    <h1>Catálogo de eventos</h1>

                    {carregando ? (
                        <p>Carregando eventos...</p>
                    ) : (
                        <div className="eventos-lista">
                            {eventos.map((evento) => (
                                <CardEvento
                                    key={evento.idEvento}
                                    id={evento.idEvento}
                                    titulo={evento.nomeEvento}
                                    imagem={evento.imagemUrl}
                                    descricao={evento.descricao}
                                    categoria={evento.idTipoEventoNavigation?.tituloTipoEvento || "Evento"}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </>
    );
}

export default Eventos;