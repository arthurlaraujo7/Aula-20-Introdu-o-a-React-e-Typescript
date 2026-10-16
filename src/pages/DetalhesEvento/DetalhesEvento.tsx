import { Link, useParams } from "react-router-dom";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import imagemPadrao from "../../assets/banner-1.png"
import relogio from "../../assets/icons/relogio.svg"
import predio from "../../assets/icons/predio.svg"
import filtro from "../../assets/icons/filtro.svg"

import "./DetalhesEvento.css"
import { useEffect, useState } from "react";
import { eventoService } from "../../services/eventPlusService";
import type { Evento } from "../../types/api";
import Botao from "../../components/botao/Botao";

function DetalhesEvento(){

    const {id = ""} = useParams();

    const [evento, setEvento] = useState<Evento | null>(null);
    const [secaoComentarios, setSecaoComentarios] = useState<boolean>(false);
    const [presenca, setPresenca] = useState<Presenca | null>(null);
    const [presencaCarregada, setPresencaCarregada] = useState("")
    const [confirmandoCancelamento, setConfirmandoCancelamento] = useState(false); 

           useEffect(() => {


async function carregar () {
if (!id) return;

const dados = await eventoService.buscar(id);

setEvento(dados);

}
void carregar();
}, [id]);

function mostrarEvento(){
console.log(evento)
}

const chavePresenca = usuario && id ? `${usuario.idUsuario}:${id}` : ""
const checandoPresenca = Boolean(chavePresenca && presencaCarregada !== chavePresenca)
return(
<>

<Header/>
<main>
<img src={evento?.imagemUrl || imagemPadrao} alt="Banner do evento" />
<h1>{evento?.nomeEvento}</h1>

<div>
<button onClick={() => setSecaoComentarios(false)}>Sobre o Evento</button>
<button onClick={() => setSecaoComentarios(true)}>Comentários</button>
{secaoComentarios ? <h2>Comentários</h2>: 
<>
<p>{evento?.descricao}</p>
</>}


</div>

<div>
        <h2>Informações principais</h2>
        <hr />

        <div><img src="src/assets/icons/relogio.svg" alt="" /><span>{evento?.dataEvento}</span></div>

        <div><img src="src/assets/icons/predio.svg" alt="" /><span>{evento?.
            idTipoEventoNavigation?.nomeFantasia}</span></div>
        
        <div><img src="src/assets/icons/filtro.svg" alt="" /><span>{evento?.
            idTipoEventoNavigation?.tituloTipoEvento}</span></div>
        
</div>

<Botao className={presenca ? "detalhe-evento-cancelar" : ""} 

/>

</main>

<Footer/>

</>

)

}

export default DetalhesEvento;