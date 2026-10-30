import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import visaoImg from "../../assets/visao.png";
import uploadIcon from "../../assets/upload.png";
import { eventoService, tipoEventoService } from "../../services/eventPlusService";
import type { Evento, TipoEvento } from "../../types/api";
import "./EventosAdmin.css";

// Função para resolver o caminho da imagem com fallback para a imagem local visaoImg
function resolverImagem(url?: string): string {
    if (!url || url.trim() === "") {
        return visaoImg;
    }
    if (url.startsWith("http") || url.startsWith("data:")) {
        return url;
    }
    return `https://localhost:7249/public/images/${url}`;
}

export default function EventosAdmin() {
    const [eventos, setEventos] = useState<Evento[]>([]);
    const [tiposEvento, setTiposEvento] = useState<TipoEvento[]>([]);

    // Form States
    const [idEventoEdicao, setIdEventoEdicao] = useState<string | null>(null);
    const [nome, setNome] = useState("");
    const [descricao, setDescricao] = useState("");
    const [dataEvento, setDataEvento] = useState("");
    const [idTipoEvento, setIdTipoEvento] = useState("");
    const [idInstituicao, setIdInstituicao] = useState("");
    const [urlFoto, setUrlFoto] = useState("");
    const [nomeArquivo, setNomeArquivo] = useState("");

    const GUID_SENAI_PADRAO = "357E2AD7-88D3-44FF-A9C2-395B7B979B4B";

    useEffect(() => {
        carregarDados();
    }, []);

    async function carregarDados() {
        try {
            const listaEventos = await eventoService.listar();
            setEventos(Array.isArray(listaEventos) ? listaEventos : []);
        } catch (error) {
            console.error("Erro ao carregar lista de eventos:", error);
        }

        try {
            const listaTipos = await tipoEventoService.listar();
            setTiposEvento(Array.isArray(listaTipos) ? listaTipos : []);
        } catch (error) {
            console.error("Erro ao carregar tipos de evento:", error);
        }
    }

    // Leitura do ficheiro de imagem e conversão para Base64
    function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) {
            setNomeArquivo(file.name);
            const reader = new FileReader();
            reader.onloadend = () => {
                setUrlFoto(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    }

   async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!idTipoEvento) {
        alert("Por favor, selecione um Tipo de Evento.");
        return;
    }

    // Garante um GUID válido com 36 carateres para a Instituição
    const guidInstituicaoValido = (idInstituicao && idInstituicao.trim().length === 36)
        ? idInstituicao.trim()
        : "357E2AD7-88D3-44FF-A9C2-395B7B979B4B";

    // Montagem limpa do payload sem enviar idEvento vazio no cadastro
    const payload: any = {
        nomeEvento: nome,
        descricao: descricao,
        dataEvento: dataEvento,
        idTipoEvento: idTipoEvento,
        idInstituicao: guidInstituicaoValido,
        imagemUrl: urlFoto || null
    };

    if (idEventoEdicao) {
        payload.idEvento = idEventoEdicao;
    }

    try {
        if (idEventoEdicao) {
            await eventoService.atualizar(idEventoEdicao, payload);
            alert("Evento atualizado com sucesso!");
        } else {
            await eventoService.cadastrar(payload);
            alert("Evento cadastrado com sucesso!");
        }

        limparFormulario();
        carregarDados();
    } catch (error: any) {
        // Exibe os detalhes exatos do Erro 400 retornados pelo .NET
        const detalheErro = error.response?.data 
            ? JSON.stringify(error.response.data, null, 2) 
            : error.message;

        console.error("Detalhes do erro 400 do Backend:", detalheErro);
        alert(`Erro no backend: ${detalheErro}`);
    }

    }

    function handleEditar(evento: any) {
        setIdEventoEdicao(evento.idEvento);
        setNome(evento.nomeEvento || evento.nome || "");
        setDescricao(evento.descricao || "");
        setDataEvento(evento.dataEvento ? evento.dataEvento.substring(0, 16) : "");
        setIdTipoEvento(evento.idTipoEvento || "");
        
        // Se idInstituicao for um GUID de 36 carateres, carrega-o; senão usa o padrão
        const inst = evento.idInstituicao;
        setIdInstituicao(inst && inst.length === 36 ? inst : GUID_SENAI_PADRAO);
        
        const foto = evento.imagemUrl || evento.urlFoto || "";
        setUrlFoto(foto);
        setNomeArquivo(foto ? "Imagem carregada" : "");
        
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    async function handleExcluir(idEvento: string) {
        if (window.confirm("Deseja realmente excluir este evento?")) {
            try {
                await eventoService.excluir(idEvento);
                carregarDados();
            } catch (error) {
                console.error("Erro ao excluir evento:", error);
            }
        }
    }

    function limparFormulario() {
        setIdEventoEdicao(null);
        setNome("");
        setDescricao("");
        setDataEvento("");
        setIdTipoEvento("");
        setIdInstituicao("");
        setUrlFoto("");
        setNomeArquivo("");
    }

    return (
        <main className="admin-container">
            <h1 className="titulo-secao-figma">ADMINISTRAÇÃO EVENTO</h1>

            <div className="admin-painel-box">
                <div className="admin-card-imagem">
                    <img src={visaoImg} alt="Ilustração Palestrante" />
                </div>

                <form className="admin-form-figma" onSubmit={handleSubmit}>
                    <div className="form-linha-dupla">
                        <input
                            type="text"
                            className="input-underline"
                            placeholder="Nome"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            required
                        />
                        <input
                            type="datetime-local"
                            className="input-underline"
                            value={dataEvento}
                            onChange={(e) => setDataEvento(e.target.value)}
                            required
                        />
                    </div>

                    <input
                        type="text"
                        className="input-underline"
                        placeholder="Descrição"
                        value={descricao}
                        onChange={(e) => setDescricao(e.target.value)}
                        required
                    />

                    <div className="form-linha-dupla">
                        <select
                            className="input-underline"
                            value={idTipoEvento}
                            onChange={(e) => setIdTipoEvento(e.target.value)}
                            required
                        >
                            <option value="">Tipo de Evento</option>
                            {tiposEvento.map((tipo: any) => (
                                <option key={tipo.idTipoEvento} value={tipo.idTipoEvento}>
                                    {tipo.tituloTipoEvento || tipo.titulo}
                                </option>
                            ))}
                        </select>

                        <input
                            type="text"
                            className="input-underline"
                            placeholder="Instituição (GUID)"
                            value={idInstituicao}
                            onChange={(e) => setIdInstituicao(e.target.value)}
                        />
                    </div>

                    <div>
                        <label htmlFor="file-upload" className="upload-label-figma">
                            <span>{nomeArquivo || "Foto"}</span>
                            <img src={uploadIcon} alt="Upload" className="upload-icone-figma" />
                        </label>
                        <input
                            id="file-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            style={{ display: "none" }}
                        />
                    </div>

                    <div>
                        <button type="submit" className="btn-submit-figma">
                            {idEventoEdicao ? "Atualizar" : "Cadastrar"}
                        </button>
                        {idEventoEdicao && (
                            <button
                                type="button"
                                className="btn-cancelar-edicao"
                                onClick={limparFormulario}
                            >
                                Cancelar edição
                            </button>
                        )}
                    </div>
                </form>
            </div>

            <h2 className="titulo-secao-figma">EVENTOS</h2>

            <div className="eventos-grid-figma">
                {eventos.map((evt: any) => (
                    <div className="card-evento-figma" key={evt.idEvento}>
                        <div className="card-imagem-container">
                            <img
                                src={resolverImagem(evt.imagemUrl || evt.urlFoto)}
                                alt={evt.nomeEvento || "Evento"}
                                onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = visaoImg;
                                }}
                            />
                        </div>

                        <div className="card-conteudo-figma">
                            <span className="badge-categoria-figma">
                                {evt.idTipoEventoNavigation?.tituloTipoEvento ||
                                 evt.tipoEvento?.tituloTipoEvento ||
                                 evt.tipoEvento?.titulo ||
                                 "Categoria"}
                            </span>
                            <h3 className="card-titulo-figma">{evt.nomeEvento}</h3>
                            <p className="card-descricao-figma">{evt.descricao}</p>

                            <div className="card-acoes-sutil">
                                <button
                                    type="button"
                                    className="btn-sutil-editar"
                                    onClick={() => handleEditar(evt)}
                                >
                                    Editar
                                </button>
                                <button
                                    type="button"
                                    className="btn-sutil-excluir"
                                    onClick={() => handleExcluir(evt.idEvento)}
                                >
                                    Excluir
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
}