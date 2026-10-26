import api from "./api";
import type { Evento, TipoEvento, Comentario, Presenca, TipoUsuario, Usuario } from "../types/api";

// Interfaces de Payload para requisições
export interface LoginPayload {
    email: string;
    senha?: string;
}

export interface EventoPayload {
    nome: string;
    dataEvento: string;
    descricao?: string;
    imagemUrl?: string;
    idTipoEvento: string;
    idInstituicao: string;
}

export interface TipoEventoPayload {
    tituloTipoEvento?: string;
    titulo?: string;
}

export interface TipoUsuarioPayload {
    tituloTipoUsuario?: string;
    titulo?: string;
}

export interface UsuarioPayload {
    nome: string;
    email: string;
    senha?: string;
    idTipoUsuario: string;
}

export interface ComentarioPayload {
    descricao: string;
    idUsuario: string;
    idEvento: string;
}

export interface PresencaPayload {
    situacao: boolean;
    idUsuario: string;
    idEvento: string;
}

// ----------------------------------------------------------------------
// Serviço de Autenticação / Login
// ----------------------------------------------------------------------
export const authService = {
    login: async (payload: LoginPayload) => {
        const response = await api.post("/Login", payload);
        return response.data;
    }
};

// ----------------------------------------------------------------------
// Serviço de Eventos
// ----------------------------------------------------------------------
export const eventoService = {
    listar: async (): Promise<Evento[]> => {
        const response = await api.get<Evento[]>("/Evento");
        return response.data;
    },

    listarProximos: async (): Promise<Evento[]> => {
        const response = await api.get<Evento[]>("/Evento/ListarProximos");
        return response.data;
    },

    buscar: async (id: string): Promise<Evento> => {
        const response = await api.get<Evento>(`/Evento/${id}`);
        return response.data;
    },

    cadastrar: async (payload: EventoPayload): Promise<Evento> => {
        const response = await api.post<Evento>("/Evento", payload);
        return response.data;
    },

    atualizar: async (id: string, payload: EventoPayload): Promise<void> => {
        await api.put(`/Evento/${id}`, payload);
    },

    excluir: async (id: string): Promise<void> => {
        await api.delete(`/Evento/${id}`);
    }
};

// ----------------------------------------------------------------------
// Serviço de Tipos de Evento (Categorias)
// ----------------------------------------------------------------------
export const tipoEventoService = {
    listar: async (): Promise<TipoEvento[]> => {
        const response = await api.get<TipoEvento[]>("/TipoEvento");
        return response.data;
    },

    buscarPorId: async (id: string): Promise<TipoEvento> => {
        const response = await api.get<TipoEvento>(`/TipoEvento/${id}`);
        return response.data;
    },

    cadastrar: async (payload: TipoEventoPayload | string): Promise<TipoEvento> => {
        const body = typeof payload === "string" ? { titulo: payload, tituloTipoEvento: payload } : payload;
        const response = await api.post<TipoEvento>("/TipoEvento", body);
        return response.data;
    },

    atualizar: async (id: string, payload: TipoEventoPayload | string): Promise<void> => {
        const body = typeof payload === "string" ? { titulo: payload, tituloTipoEvento: payload } : payload;
        await api.put(`/TipoEvento/${id}`, body);
    },

    excluir: async (id: string): Promise<void> => {
        await api.delete(`/TipoEvento/${id}`);
    }
};

// ----------------------------------------------------------------------
// Serviço de Tipos de Usuário
// ----------------------------------------------------------------------
export const tipoUsuarioService = {
    listar: async (): Promise<TipoUsuario[]> => {
        const response = await api.get<TipoUsuario[]>("/TipoUsuario");
        return response.data;
    },

    buscarPorId: async (id: string): Promise<TipoUsuario> => {
        const response = await api.get<TipoUsuario>(`/TipoUsuario/${id}`);
        return response.data;
    },

    cadastrar: async (payload: TipoUsuarioPayload | string): Promise<TipoUsuario> => {
        const body = typeof payload === "string" ? { titulo: payload, tituloTipoUsuario: payload } : payload;
        const response = await api.post<TipoUsuario>("/TipoUsuario", body);
        return response.data;
    },

    atualizar: async (id: string, payload: TipoUsuarioPayload | string): Promise<void> => {
        const body = typeof payload === "string" ? { titulo: payload, tituloTipoUsuario: payload } : payload;
        await api.put(`/TipoUsuario/${id}`, body);
    },

    deletar: async (id: string): Promise<void> => {
        await api.delete(`/TipoUsuario/${id}`);
    },

    excluir: async (id: string): Promise<void> => {
        await api.delete(`/TipoUsuario/${id}`);
    }
};

// ----------------------------------------------------------------------
// Serviço de Usuários
// ----------------------------------------------------------------------
export const usuarioService = {
    listar: async (): Promise<Usuario[]> => {
        const response = await api.get<Usuario[]>("/Usuario");
        return response.data;
    },

    buscar: async (id: string): Promise<Usuario> => {
        const response = await api.get<Usuario>(`/Usuario/${id}`);
        return response.data;
    },

    buscarPorId: async (id: string): Promise<Usuario> => {
        const response = await api.get<Usuario>(`/Usuario/${id}`);
        return response.data;
    },

    cadastrar: async (payload: UsuarioPayload): Promise<Usuario> => {
        const response = await api.post<Usuario>("/Usuario", payload);
        return response.data;
    },

    atualizar: async (id: string, payload: UsuarioPayload): Promise<void> => {
        await api.put(`/Usuario/${id}`, payload);
    },

    deletar: async (id: string): Promise<void> => {
        await api.delete(`/Usuario/${id}`);
    },

    excluir: async (id: string): Promise<void> => {
        await api.delete(`/Usuario/${id}`);
    }
};

// ----------------------------------------------------------------------
// Serviço de Comentários
// ----------------------------------------------------------------------
export const comentarioService = {
    listarPorEvento: async (idEvento: string): Promise<Comentario[]> => {
        // Altere de /ComentariosEvento para /Comentario (ou mantenha sincronizado com o C#)
        const response = await api.get<Comentario[]>(`/Comentario/ListarPorEvento/${idEvento}`);
        return response.data;
    },

    cadastrar: async (payload: ComentarioPayload): Promise<Comentario> => {
        const response = await api.post<Comentario>("/Comentario", payload);
        return response.data;
    },

    deletar: async (idComentario: string): Promise<void> => {
        await api.delete(`/Comentario/${idComentario}`);
    }
};

// ----------------------------------------------------------------------
// Serviço de Presenças / Inscrições
// ----------------------------------------------------------------------
export const presencaService = {
    listarPorUsuario: async (idUsuario: string): Promise<Presenca[]> => {
        const response = await api.get<Presenca[]>(`/PresencaEvento/ListarMinhas/${idUsuario}`);
        return response.data;
    },

    cadastrar: async (payload: PresencaPayload): Promise<Presenca> => {
        const response = await api.post<Presenca>("/PresencaEvento", payload);
        return response.data;
    },

    excluir: async (idPresenca: string): Promise<void> => {
        await api.delete(`/PresencaEvento/${idPresenca}`);
    }
};