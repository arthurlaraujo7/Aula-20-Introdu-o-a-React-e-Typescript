import { useEffect, useState } from "react";
import { useAuth } from "../../context/auth";
import { presencaService } from "../../services/eventPlusService";
import type { Presenca } from "../../types/api";

export const MinhaConta = () => {
    const { usuario } = useAuth();
    const [presencas, setPresencas] = useState<Presenca[]>([]);

    useEffect(() => {
        if (usuario?.idUsuario) {
            presencaService.listarPorUsuario(usuario.idUsuario)
                .then(setPresencas)
                .catch(console.error);
        }
    }, [usuario]);

    return (
        <main className="container">
            <h1>Minha Conta</h1>
            <p><strong>Nome:</strong> {usuario?.nome}</p>
            <p><strong>E-mail:</strong> {usuario?.email}</p>

            <h2>Meus Eventos / Presenças</h2>
            {presencas.length === 0 ? (
                <p>Você ainda não confirmou presença em nenhum evento.</p>
            ) : (
                <ul>
                    {presencas.map((p) => (
                        <li key={p.idPresenca}>
                            {p.evento?.nomeEvento} - {p.situacao ? "Confirmado" : "Pendente"}
                        </li>
                    ))}
                </ul>
            )}
        </main>
    );
};

export default MinhaConta;