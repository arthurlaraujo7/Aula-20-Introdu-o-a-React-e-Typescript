import { useCallback, useEffect, useState, type ChangeEvent, type FormEvent } from "react";

import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import Campo from "../../components/campo/Campo";
import Botao from "../../components/botao/Botao";
import ListaUsuarios from "../../components/listaUsuarios/ListaUsuarios";
import ModalConfirmacao from "../../components/modalConfirmacao/ModalConfirmacao";

import type { TipoUsuario, Usuario } from "../../types/api";
import { tipoUsuarioService, usuarioService } from "../../services/eventPlusService";
import { getApiErrorMessage } from "../../services/api";

import ilustracaoImg from "../../assets/visao.png";
import "./Usuarios.css";

interface FormularioUsuario {
    nome: string;
    email: string;
    senha: string;
    idTipoUsuario: string;
}

const inicial: FormularioUsuario = { nome: "", email: "", idTipoUsuario: "", senha: "" };

function Usuarios() {
    const [formulario, setFormulario] = useState<FormularioUsuario>(inicial);
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [tipos, setTipos] = useState<TipoUsuario[]>([]);
    const [idEmEdicao, setIdEmEdicao] = useState<string | null>(null);
    const [selecionado, setSelecionado] = useState<Usuario | null>(null);
    const [carregando, setCarregando] = useState(true);
    const [enviando, setEnviando] = useState(false);
    const [mensagem, setMensagem] = useState("");

    const carregar = useCallback(async () => {
        setCarregando(true);
        setMensagem("");
        try {
            const [usuariosApi, tiposApi] = await Promise.all([
                usuarioService.listar(),
                tipoUsuarioService.listar()
            ]);
            setUsuarios(usuariosApi);
            setTipos(tiposApi);
            setFormulario((value) => ({
                ...value,
                idTipoUsuario: value.idTipoUsuario || tiposApi[0]?.idTipoUsuario || ""
            }));
        } catch (error) {
            setMensagem(getApiErrorMessage(error));
        } finally {
            setCarregando(false);
        }
    }, []);

    useEffect(() => {
        const timeout = window.setTimeout(() => void carregar(), 0);
        return () => window.clearTimeout(timeout);
    }, [carregar]);

    function atualizar(event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        setFormulario((value) => ({ ...value, [event.target.name]: event.target.value }));
    }

    function limpar() {
        setFormulario({ ...inicial, idTipoUsuario: tipos[0]?.idTipoUsuario || "" });
        setIdEmEdicao(null);
        setMensagem("");
    }

    async function salvar(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setEnviando(true);
        setMensagem("");
        try {
            const payload = {
                ...formulario,
                nome: formulario.nome.trim(),
                email: formulario.email.trim(),
                idTipoUsuario: formulario.idTipoUsuario || null
            };

            if (idEmEdicao) {
                await usuarioService.atualizar(idEmEdicao, payload);
            } else {
                await usuarioService.cadastrar(payload);
            }
            limpar();
            await carregar();
        } catch (error) {
            setMensagem(getApiErrorMessage(error));
        } finally {
            setEnviando(false);
        }
    }

    function editar(usuario: Usuario) {
        if (!usuario.idUsuario) return;
        setIdEmEdicao(usuario.idUsuario);
        setFormulario({
            nome: usuario.nome || "",
            email: usuario.email || "",
            idTipoUsuario: usuario.idTipoUsuario || "",
            senha: ""
        });
        setMensagem("Informe uma nova senha para concluir a edição.");
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    async function excluir() {
        if (!selecionado?.idUsuario) return;
        setEnviando(true);
        try {
            await usuarioService.excluir(selecionado.idUsuario);
            if (idEmEdicao === selecionado.idUsuario) limpar();
            await carregar();
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
            <main className="usuarios-page">
                <section className="usuarios-form-section">
                    <div className="usuarios-form-container">
                        <h1 className="usuarios-titulo">ADMINISTRAÇÃO USUÁRIO</h1>

                        <div className="usuarios-form-flex">
                            <div className="usuarios-ilustracao">
                                <img src={ilustracaoImg} alt="Ilustração da administração de usuários" />
                            </div>

                            <form className="usuarios-form" onSubmit={salvar}>
                                <div className="form-group">
                                    <Campo
                                        id="usuario-nome"
                                        name="nome"
                                        type="text"
                                        value={formulario.nome}
                                        onChange={atualizar}
                                        placeholder="Nome"
                                        maxLength={100}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <Campo
                                        id="usuario-email"
                                        name="email"
                                        type="email"
                                        value={formulario.email}
                                        onChange={atualizar}
                                        placeholder="Email"
                                        required
                                    />
                                </div>

                                <div className="form-row">
                                    <div className="select-container">
                                        <select
                                            name="idTipoUsuario"
                                            id="usuario-tipo"
                                            value={formulario.idTipoUsuario}
                                            onChange={atualizar}
                                            required
                                        >
                                            <option value="" disabled>Tipo de Usuário</option>
                                            {tipos.map((tipo) => (
                                                <option key={tipo.idTipoUsuario} value={tipo.idTipoUsuario}>
                                                    {tipo.tituloTipoUsuario || (tipo as { titulo?: string }).titulo || "Tipo"}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <Campo
                                        id="usuario-senha"
                                        name="senha"
                                        type="password"
                                        value={formulario.senha}
                                        onChange={atualizar}
                                        placeholder="Senha"
                                        required={!idEmEdicao}
                                    />
                                </div>

                                <div className="form-botoes">
                                    <Botao
                                        texto={enviando ? "Salvando..." : idEmEdicao ? "Salvar" : "Cadastrar"}
                                        type="submit"
                                        disabled={enviando}
                                    />
                                    {idEmEdicao && (
                                        <button
                                            type="button"
                                            className="btn-cancelar"
                                            onClick={limpar}
                                        >
                                            Cancelar
                                        </button>
                                    )}
                                </div>

                                {mensagem && <p className="mensagem-feedback">{mensagem}</p>}
                            </form>
                        </div>
                    </div>
                </section>

                <section className="usuarios-lista-section">
                    <div className="usuarios-lista-container">
                        <h2 className="usuarios-lista-titulo">LISTA USUÁRIOS</h2>

                        <ListaUsuarios
                            usuarios={usuarios}
                            idEmEdicao={idEmEdicao}
                            carregando={carregando}
                            onEditar={editar}
                            onExcluir={setSelecionado}
                        />
                    </div>
                </section>

                <ModalConfirmacao
                    show={Boolean(selecionado)}
                    titulo="Excluir usuário"
                    mensagem={selecionado ? `Deseja excluir "${selecionado.nome}"?` : ""}
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

export default Usuarios;