import { useState, useEffect } from "react";
import {useNavigate} from "react-router-dom";
import { Link } from "react-router-dom";
import type { IBoard } from "../../common/interfaces/IBoard.ts";
import BoardComponent from "./components/BoardComponent/BoardComponent.tsx";
import api from "../../api/request.ts";
import toast from "react-hot-toast";
import CreateModal from "../../components/CreateModal/CreateModal.tsx";

function Home () {
    const navigate = useNavigate();
    const [boards, setBoards] = useState<IBoard[]>([]);
    const [modalStatus, setModalStatus] = useState<boolean>(false);

    useEffect(() => {
        async function fetchBoards(){
            try {
                const result = await api.get('/board');
                setBoards(result.boards);
            } catch (err: any) {
                console.error(err);

                if (err.response) {
                    const status = err.response.status;

                    if (status === 401) {
                        toast.error("Unauthorized. Please log in again");
                        navigate("/login");
                    } else {
                        toast.error("Failed to load boards");
                    }
                } else if (err.request) {
                    toast.error("Network error. Please check your connection");
                } else {
                    toast.error("An error occurred: " + err.message);
                }
            }
        }
        fetchBoards();
    }, []);

    async function createBoard(title: string, color: string) {
        try {
            const response = await api.post('/board', {
                title: title,
                custom: {
                    background: color
                }
            });
            const newBoard: IBoard = {
                id: response.id,
                title: title,
                custom: {
                    background: color
                }
            };

            setBoards([...boards, newBoard]);
            setModalStatus(false);
            toast.success("Board created successfully");

        } catch (err: any) {
            console.error(err);

            if (err.response) {
                const status = err.response.status;

                if (status === 400) {
                    toast.error("Invalid board data");
                } else {
                    toast.error("Failed to create board. Please try again later");
                }
            } else if (err.request) {
                toast.error("Network error. Please check your connection");
            } else {
                toast.error("An error occurred: " + err.message);
            }
        }
    }

    const logOut = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        navigate("/login");
    }

    return (
        <>
            <h1 className="title">Your boards</h1>
            <button className="button-logout" onClick={logOut}>Log out</button>
            <div className="board-container">
                {boards.map((board) => (
                    <Link key={board.id} to={`/board/${board.id}`}>
                        <BoardComponent
                            title={board.title}
                            custom={board.custom}
                        />
                    </Link>
                ))}
            </div>
            <button className="add-board-btn" onClick={() => setModalStatus(true)}>+ add new board</button>

            <CreateModal
                modalStatus={modalStatus}
                onClose={() => setModalStatus(false)}
                modalTitle="Create new board"
                placeholder="Board Title"
                withColorPicker={true} 
                onSubmit={({ text, color }) => createBoard(text, color)}
            />
        </>
    )
}

export default Home;