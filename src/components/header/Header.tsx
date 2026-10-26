import { Link, NavLink, useNavigate } from "react-router-dom";
import logoEvent from "../../assets/logo-event.svg";
import "./Header.css";
import { perfilEhAdministrador, perfilEhOrganizador, useAuth } from "../../context/auth";

function Header() {
    const { autenticado, usuario, perfil, logout } = useAuth();

    const navigate = useNavigate();
    const administrador = perfilEhAdministrador(perfil);
    const organizador = perfilEhOrganizador(perfil);

    function sair(e: React.MouseEvent<HTMLAnchorElement>) {
        e.preventDefault();
        logout();
        navigate("/login");
    }

    return (
        <header className="header">
            <div className="header-conteudo">
                <Link to="/home">
                    <img src={logoEvent} alt="Logo Event+" />
                </Link>

                <nav>
                    <NavLink to="/home">Home</NavLink>
                    <NavLink to="/eventos">Eventos</NavLink>

                    {/* Exibe o gerenciamento de eventos apenas para Administrador ou Organizador */}
                    {(administrador || organizador) && (
                        <>
                            <NavLink to="/eventos-admin">Eventos Admin</NavLink>
                            <NavLink to="/tipo-evento">Tipos de Evento</NavLink>
                        </>
                    )}

                    {/* Exibe a gestão de usuários apenas se for Administrador */}
                    {administrador && (
                        <NavLink to="/usuarios">Usuários</NavLink>
                    )}

                    <Link to="/home#contato">Contatos</Link>
                </nav>

                <div className="header-acoes">
                    {autenticado ? (
                        <>
                            <span className="header-usuario-nome">
                                {usuario?.nome ?? "Usuário"}
                            </span>
                            <a href="#sair" onClick={sair} className="header-link-sair">
                                Sair
                            </a>
                        </>
                    ) : (
                        <Link to="/login">Entrar</Link>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Header;