import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import type { IBoard } from "../../common/interfaces/IBoard.ts";
import BoardComponent from "./components/BoardComponent/BoardComponent.tsx";
import Modal from "./components/Modal/Modal.tsx";
import api from "../../api/request.ts";

function Home () {
    const [boards, setBoards] = useState<IBoard[]>([]);
    const [modalStatus, setModalStatus] = useState<boolean>(false);

    useEffect(() => {
        async function fetchBoards(){
            const result = await api.get('/board');
            setBoards(result.boards);
        }
        fetchBoards();
    }, []);

    async function createBoard(title: string, color: string) {
        const response = await api.post('/board', {
            title: title,
            custom: {
                background: color
            }
        });
        console.log("Сервер відповів:", response.data);
        const newBoard: IBoard = {
            id: response.id,
            title: title,
            custom: {
                background: color
            }
        };

        setBoards([...boards, newBoard]);
        setModalStatus(false);
    }

    return (
        <>
            <h1 className="title">Your boards</h1>
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

            <Modal modalStatus={modalStatus} onClose={() => setModalStatus(false)} onSubmit={createBoard}/>
        </>
    )
}

export default Home;