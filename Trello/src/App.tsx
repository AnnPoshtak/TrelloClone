import Board from './pages/Board/Board.tsx'
import Home from './pages/Home/Home.tsx'
import Register from './pages/Register/Register.tsx'
import Login from './pages/Login/Login.tsx'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {Toaster} from "react-hot-toast"

function App(){
    return (
        <div>
            <Toaster position="top-right"/>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home/> } />
                    <Route path="/board/:board_id" element={<Board/> } />
                    <Route path="/register" element={<Register/> } />
                    <Route path="/login" element={<Login/> } />
                </Routes>
            </BrowserRouter>
        </div>
    )
}

export default App