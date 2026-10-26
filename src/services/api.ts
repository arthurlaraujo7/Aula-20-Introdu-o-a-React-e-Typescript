import axios from "axios";

export const SESSION_STORAGE_KEY = "@eventplus:user";
export const UNAUTHORIZED_EVENT = "unauthorized_access";

export class ApiError extends Error {
    status?: number;
    data?: unknown;
    constructor(message: string, status?: number, data?: unknown) {
        super(message);
        this.status = status;
        this.data = data;
    }
}

export const api = axios.create({
    baseURL: "https://localhost:7249/api", // Ajuste a porta da sua API C#
});

// Interceptor de Requisição: Anexa o Bearer Token automaticamente
api.interceptors.request.use(
    (config) => {
        const userJson = sessionStorage.getItem(SESSION_STORAGE_KEY);
        if (userJson) {
            try {
                const user = JSON.parse(userJson);
                if (user?.token) {
                    config.headers.Authorization = `Bearer ${user.token}`;
                }
            } catch (e) {
                console.error("Erro ao ler token da sessão", e);
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Interceptor de Resposta: Trata erros globais
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;
        const motivo = error.response?.data || error.message;

        if (status === 401) {
            window.dispatchEvent(new Event(UNAUTHORIZED_EVENT));
        }

        return Promise.reject(new ApiError(motivo, status, error.response?.data));
    }
);

export function getApiErrorMessage(error: unknown) {
    if (error instanceof ApiError) {
        return error.message;
    }
    return "Ocorreu um erro inesperado. Tente Novamente.";
}

export default api;