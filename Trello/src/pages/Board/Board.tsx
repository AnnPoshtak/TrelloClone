import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import type { IList } from "../../common/interfaces/IList.ts";
import type { IBoard } from "../../common/interfaces/IBoard.ts";
import List from "./components/List/List.tsx";
import CreateListModal from "./components/CreateListModal/CreateListModal.tsx";
import api from "../../api/request.ts";

function Board() {
    const { board_id } = useParams();
    const [board, setBoard] = useState<IBoard | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [lists, setLists] = useState<IList[]>([
        { id: 1, title: "Плани", cards: [{ id: 1, title: "помити кота" }] },
    ]);

    useEffect(() => {
        async function fetchBoardData() {
            if (!board_id) return;
            const response = await api.get(`/board/${board_id}`);
            setBoard(response);
            if (response.lists) setLists(response.lists);
        }
        fetchBoardData();
    }, [board_id]);

    async function handleCreateList(title: string) {
        const newPosition = lists.length + 1;
        const response = await api.post(`/board/${board_id}/list`, {
            title: title,
            position: newPosition
        });
        const newList: IList = {
            id: response.id || Date.now(),
            title: title,
            cards: []
        };

        setLists([...lists, newList]);
        setIsModalOpen(false);
    }

    if (!board) return <div>Завантаження...</div>;

    return (
        <div className="board">
            <h1 className="title">{board.title}</h1>

            <div className="lists-container">
                {lists.map((list) => (
                    <List
                        key={list.id}
                        id={list.id}
                        title={list.title}
                        cards={list.cards}
                    />
                ))}
                <button className="add-list-btn" onClick={() => setIsModalOpen(true)}>
                    + add new list
                </button>
            </div>

            <CreateListModal
                modalStatus={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreateList}
            />
        </div>
    );
}

export default Board;