import { Route, Routes } from "react-router-dom";

import Home from "../pages/Home/Home";
import Login from "../pages/login/Login";
import Eventos from "../pages/Eventos/Eventos";
import DetalhesEvento from "../pages/DetalhesEvento/DetalhesEvento";
import EventosAdmin from "../pages/eventosAdmin/EventosAdmin"; // Importação do Admin
import Usuarios from "../pages/usuarios/Usuarios";
import TipoUsuarioPage from "../pages/tipoUsuario/TipoUsuario";
import TipoEventoPage from "../pages/tipoEvento/TipoEvento";
import PrivateRoute from "./PrivateRoute";
import MinhaConta from "../pages/minhaConta/MinhaConta";

function AppRoutes() {
    return (
        <Routes>
            {/* Rotas Públicas */}
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/eventos" element={<Eventos />} />
            <Route path="/detalhes-evento/:id" element={<DetalhesEvento />} />
            <Route path="/eventos/:id" element={<DetalhesEvento />} />
            <Route path="/conta" element={<MinhaConta />} />

            {/* Rotas Protegidas (Requer Login) */}
            <Route element={<PrivateRoute />}>
                <Route path="/eventos-admin" element={<EventosAdmin />} />
                <Route path="/usuarios" element={<Usuarios />} />
                <Route path="/tipo-usuario" element={<TipoUsuarioPage />} />
                <Route path="/tipo-evento" element={<TipoEventoPage />} />
            </Route>
        </Routes>
    );
}

export default AppRoutes;