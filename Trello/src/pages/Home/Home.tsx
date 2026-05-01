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

    const [activeTab, setActiveTab] = useState<"Дошки" | "Останні дії" | "Налаштування" | "По приколу">("Дошки");

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
        <nav className="absolute left-0 top-0 h-full w-25">
           <div>Дошки</div>
           <div>Останні дії</div>
           <div>Налаштування</div> 
           <div>По приколу</div>
        </nav>
            <div className="flex flex-col items-center py-10 px-5">
                <h1 className="text-[3rem] font-bold mb-[15px]">Boards</h1>
                <div className="flex gap-4">
                    <button onClick={logOut}>Log out</button>
                    <button onClick={() => setModalStatus(true)}>+ New Board</button>
                </div>
            </div>
            
            <div className="flex flex-wrap gap-20 p-20 justify-center">
                {boards.map(board => (
                    <BoardComponent
                        key={board.id}
                        title={board.title}
                        custom={board.custom}
                        board={board}
                    />
                ))}
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