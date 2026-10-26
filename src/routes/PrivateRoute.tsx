import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/auth";

function PrivateRoute() {
    const { usuario } = useAuth();

    // Se houver usuário autenticado, renderiza a rota filha; caso contrário, redireciona para o login
    return usuario ? <Outlet /> : <Navigate to="/login" replace />;
}

export default PrivateRoute;