import type { ButtonHTMLAttributes } from "react";

import "./botao.css"

interface BotaoProps extends ButtonHTMLAttributes<HTMLButtonElement>{
    texto?: string;
    className?: string;
}

function Botao({
    texto,
    onClick,
    type = "button",
    className = "",
    ...props
}: BotaoProps){

  
    const classes = ["botao", className].filter(Boolean).join("");  
      
    return (
        <button className="{classname"> OnClick={onClick} type={type} {...props};
        {texto || "clique aqui"}
        </button>
    )

    


}

export default Botao;