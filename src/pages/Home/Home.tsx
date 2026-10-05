import logoEvent from "../../assets/logo-event.svg";
import bannerEvento1 from "../../assets/banner-1.png"
import bannerEvento2 from "../../assets/banner-2.png"
import bannerEvento3 from "../../assets/banner-3.png"
import visao from "../../assets/visao.png"

import Carrossel from "../../components/Carrossel/Carrossel";

import "./Home.css"


function Home() {
    return (

        <>
            <header className="home-header">
                <div className="home-header-conteudo">
                    <img src={logoEvent} alt="Event+" />

                    <nav>
                        <a href="#Inicio">Home</a>
                        <a href="#Eventos">Eventos</a>
                        <a href="#Usuarios">Usuarios</a>
                        <a href="#Contato">Contato</a>
                    </nav>

                    <button>Entrar</button>

                </div>
            </header>

            <main>
           
             
             <Carrossel></Carrossel>

                <section className="home-visao">

                    <div className="home-visao-container">
                        <img src={visao} alt="Pessoas
    confraternizando" />
                        <div className="home-visao-texto">
                            <h1>Visão</h1>
                            <p>A EventPlus organiza eventos e informações em uma interface direta,
                                facilitando a consulta da agenda e a participação do usuários.</p>
                        </div>
                    </div>



                </section>

                <section id="Eventos" className="home-eventos">
                    <div className="home-eventos-titulo">
                        <h2>Próximos Eventos</h2>
                        <hr />
                    </div>

                    <div className="home-eventos-lista">
                        <article className="home-evento-card">

                            <img src={bannerEvento1} alt="Evento de Tecnologia" />
                            <span>Tecnologia</span>

                            <div className="home-eventos-card-info">

                                <h3>Evento de Tecnologia</h3>
                                <p>Conheça novidades e tendências do setor</p>
                                <button type="button">Ver evento</button>

                            </div>
                        </article>

                        <article className="home-evento-card">
                            <img src={bannerEvento2} alt="Workshop de desenvolvimento" />
                            <span>Workshop</span>

                            <div className="home-eventos-card-info">


                                <h3>Workshop de Desenvolvimento</h3>
                                <p>Pratique desenvolvimento com atividades guiadas.</p>
                                <button type="button">Ver evento</button>

                            </div>

                        </article>

                        <article className="home-evento-card">
                            <img src={bannerEvento3} alt="Meetup de inteligência" />
                            <span>Meetup</span>

                            <div className="home-eventos-card-info">


                                <h3>Meetup de IA</h3>
                                <p>Discussões sobre aplicações de inteligência artificial</p>
                                <button type="button">Ver evento</button>

                            </div>

                        </article>
                    </div>

                </section>

                <section id="Contato" className="home-contato">
                    <div className="home-contato-container">
                        <div className="home-contato-titulo">
                            <h2>Contato</h2>
                            <hr />
                        </div>


                        <div className="home-contato-conteudo">
                            <div className="home-contato-endereco">
                                <p>Rua Niterói, 180 - Centro</p>
                                <p>São Caetano do Sul - SP</p>
                            </div>


                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d58492.30493554122!2d-46.58720495086828!3d-23.612614004400942!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce5d11c031c57f%3A0x8f79f71018065a16!2sSENAI%20S%C3%A3o%20Caetano%20do%20Sul%20-%20Cyber%20e%20IA!5e0!3m2!1spt-BR!2sbr!4v1791222403324!5m2!1spt-BR!2sbr"
                                loading="lazy"
                            ></iframe>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="home-footer">
                <p>Escola Senai de Informática - 2026</p>
            </footer>
        </>

    );

}

export default Home;