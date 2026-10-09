export interface TipoEvento{
idTipoEvento: string;
tituloTipoEvento: string;
// tituloEvento: string;
}

export interface instituicao{
idInstituicao: string;
cnpj: string;
nomeFantasia: string;
}

export interface Evento{
idEvento: string;
nomeEvento: string;
// nome: string;
descricao: string;
dataEvento: string;
imagemUrl?: string | null;
// idTipoEvento?: string | null;
// idInstituicao?: string | null;
idTipoEventoNavigation?: TipoEvento | null;
// idInstituicaoNavigation?: instituicao | null;


}