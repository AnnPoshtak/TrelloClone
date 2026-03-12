import { BrowserRouter, Route, Routes } from "react-router-dom";
import Board from '../pages/Board/Board.tsx';
import Home from '../pages/Home/Home.tsx';
import Register from '../pages/Register/Register.tsx';
import Login from '../pages/Login/Login.tsx';

import ProtectedRoute from "./ProtectedRoute/ProtectedRoute.tsx";
import PublicRoute from "./PublicRoute/PublicRoute.tsx";

function Router() {
    return (
        <div>
            <BrowserRouter>
                <Routes>
                    <Route element={<ProtectedRoute />}>
                        <Route path="/" element={<Home />} />
                        <Route path="/board/:board_id" element={<Board />} />
                    </Route>

                    <Route element={<PublicRoute />}>
                        <Route path="/register" element={<Register />} />
                        <Route path="/login" element={<Login />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default Router;