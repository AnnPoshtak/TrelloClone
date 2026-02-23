import { BrowserRouter, Route, Routes, Navigate, Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Board from './pages/Board/Board.tsx';
import Home from './pages/Home/Home.tsx';
import Register from './pages/Register/Register.tsx';
import Login from './pages/Login/Login.tsx';

function ProtectedRoute() {
    const token = localStorage.getItem('token');

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}

function App() {
    return (
        <div>
            <Toaster position="top-right"/>
            <BrowserRouter>
                <Routes>
                    <Route element={<ProtectedRoute />}>
                        <Route path="/" element={<Home />} />
                        <Route path="/board/:board_id" element={<Board />} />
                    </Route>

                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;