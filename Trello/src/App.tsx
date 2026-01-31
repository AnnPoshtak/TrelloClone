import Board from './pages/Board/Board.tsx'
import Home from './pages/Home/Home.tsx'
import {BrowserRouter, Route, Routes} from "react-router-dom";

function App(){
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home/> } />
                <Route path="/board" element={<Board/> } />
            </Routes>
        </BrowserRouter>
    )
}

export default App