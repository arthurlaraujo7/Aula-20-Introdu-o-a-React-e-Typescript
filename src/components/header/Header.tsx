import logoEvent from "../../assets/logo-event.svg";

function Header() {
    return (
        <header className="home-header">
            <div className="home-header-conteudo">
                <img src={logoEvent} alt="Event+" />
                <nav>
                    <a href="#Inicio">Home</a>
                    <a href="#Eventos">Eventos</a>
                    <a href="#Usuarios">Usuarios</a>
                    <a href="#Contato">Contato</a>
                </nav>
                <button type="button">Entrar</button>
            </div>
        </header>
    );
}

export default Header; 