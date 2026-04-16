import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import type { IBoard } from "../../common/interfaces/IBoard.ts";
import BoardComponent from "./components/BoardComponent/BoardComponent.tsx";
import api from "../../api/request.ts";
import toast from "react-hot-toast";
import CreateModal from "../../components/CreateModal/CreateModal.tsx";

function Home() {
    const navigate = useNavigate();
    const [boards, setBoards] = useState<IBoard[]>([]);
    const [modalStatus, setModalStatus] = useState<boolean>(false);

    useEffect(() => {
        async function fetchBoards() {
            try {
                const response = await api.get('/board');
                setBoards(response.boards || response.data); 
            } catch (err: any) {
                if (err.response?.status === 401) {
                    navigate("/login");
                } else {
                    toast.error("Error loading boards");
                }
            }
        }
        fetchBoards();
    }, [navigate]);

    async function createBoard(title: string, color: string) {
        try {
            const response = await api.post('/board', {
                title: title,
                custom: { background: color }
            });

            const newBoard: IBoard = {
                id: response.id,
                title: title,
                custom: { background: color } as any 
            };

            setBoards([...boards, newBoard]);
            setModalStatus(false);
            toast.success("Created");
        } catch (err: any) {
            toast.error("Error");
        }
    }

    const logOut = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        navigate("/login");
    }

    return (
        <>
            <div className="title">
                <h1>Boards</h1>
                <button onClick={logOut}>Log out</button>
            </div>
            
            <div className="board-container">
                {boards.map((board) => {
                    const boardColor = board.custom?.background 
                        || (Array.isArray(board.custom) && board.custom[0]?.background) 
                        || "#6366f1";

                    return (
                        <Link key={board.id} to={`/board/${board.id}`} style={{ textDecoration: 'none' }}>
                            <div className="board-card" style={{ "--board-color": boardColor } as React.CSSProperties}>
                                {board.title}
                            </div>
                        </Link>
                    );
                })}
            </div>
            
            <div style={{ textAlign: 'center' }}>
                <button className="add-board-btn" onClick={() => setModalStatus(true)}>+ New Board</button>
            </div>

            <CreateModal
                modalStatus={modalStatus}
                onClose={() => setModalStatus(false)}
                modalTitle="New board"
                placeholder="Title"
                withColorPicker={true} 
                onSubmit={({ text, color }) => createBoard(text, color || "#6366f1")}
            />
        </>
    )
}

export default Home;