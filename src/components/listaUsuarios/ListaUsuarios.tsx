import type { Usuario } from "../../types/api";
import lapisIcon from "../../assets/icons/lapis.svg";
import lixeiraIcon from "../../assets/icons/lixeira.svg";
import "./ListaUsuarios.css";

interface ListaUsuariosProps {
    usuarios: Usuario[];
    idEmEdicao: string | null;
    carregando: boolean;
    onEditar: (usuario: Usuario) => void;
    onExcluir: (usuario: Usuario) => void;
}

function ListaUsuarios({ usuarios, idEmEdicao, carregando, onEditar, onExcluir }: ListaUsuariosProps) {
    if (carregando) {
        return <p className="lista-status">Carregando usuários...</p>;
    }

    if (usuarios.length === 0) {
        return <p className="lista-status">Nenhum usuário cadastrado.</p>;
    }

    return (
        <div className="tabela-container">
            <table className="tabela-usuarios">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>E-mail</th>
                        <th>Tipo Usuário</th>
                        <th className="col-acao">Editar</th>
                        <th className="col-acao">Deletar</th>
                    </tr>
                </thead>
                <tbody>
                    {usuarios.map((usuario) => (
                        <tr 
                            key={usuario.idUsuario} 
                            className={idEmEdicao === usuario.idUsuario ? "linha-edicao" : ""}
                        >
                            <td>{usuario.nome}</td>
                            <td>{usuario.email}</td>
                            <td>
                                {usuario.idTipoUsuarioNavigation?.tituloTipoUsuario || 
                                 (usuario.idTipoUsuarioNavigation as { titulo?: string })?.titulo || 
                                 "Comum"}
                            </td>
                            <td className="col-acao">
                                <button
                                    type="button"
                                    className="btn-icone"
                                    title="Editar"
                                    onClick={() => onEditar(usuario)}
                                >
                                    <img src={lapisIcon} alt="Editar" />
                                </button>
                            </td>
                            <td className="col-acao">
                                <button
                                    type="button"
                                    className="btn-icone"
                                    title="Excluir"
                                    onClick={() => onExcluir(usuario)}
                                >
                                    <img src={lixeiraIcon} alt="Excluir" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ListaUsuarios;