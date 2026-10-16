import { axiosInstance } from "./api";

import type { Evento, LoginPayload, Presenca, PresencaPayLoad, Usuario } from "../types/api";

export const authService = {

    async login (payload: LoginPayload){
        const { data }=await axiosInstance.post<Login>
    }
}


export const eventoService = {
    async listar(){
        const {data} = await axiosInstance.get<Evento[]>("Evento")
        return data;
    },


    async listarProximos(){
        const {data} = await axiosInstance.get<Evento[]>("Eventos/proximos");
        return data;
    },

    async buscar(id: string){
        const {data} = await axiosInstance.get<Evento>(`Evento/${id}`)
        return data;
    }
}

export const presencaService = {
    async listarPorUsuario(idUsuario: string){
        const {data} = await axiosInstance.get<Presenca>(`Presenca/usuario/$
            {idUsuario}`);
            return data;
    },

    async cadastrar(payload: PresencaPayLoad) {

        const {data} = await axiosInstance.post<Presenca>("/Presenca", payload);
        return data;
    },

    async excluir(id: string){
        await axiosInstance.delete(`Presenca/${id}`);
    }
}

export const usuarioService = {
    async buscar(id:string){
        const {data } = await axiosInstance.get<Usuario>(`Usuario/${id}`);
        return data;
    }
}
