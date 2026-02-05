import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import type { IList } from "../../common/interfaces/IList.ts";
import type { IBoard } from "../../common/interfaces/IBoard.ts";
import List from "./components/List/List.tsx";
import CreateListModal from "./components/CreateListModal/CreateListModal.tsx";
import CreateCardModal from "./components/CreateCardModal/CreateCardModal.tsx";
import api from "../../api/request.ts";

function Board() {
    const { board_id } = useParams();
    const [board, setBoard] = useState<IBoard | null>(null);
    const [isListModalOpen, setIsListModalOpen] = useState(false);
    const [isCardModalOpen, setIsCardModalOpen] = useState(false);

    const [lists, setLists] = useState<IList[]>([]);

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
        setIsListModalOpen(false);
    }

    async function handleCreateCard(title: string, listId: number) {
        const targetList = lists.find(list => list.id === listId);
        if (!targetList) return;
        const newPosition = targetList.cards.length + 1;
        const payload = {
            title: title,
            list_id: listId,
            position: newPosition,
            description: "",
        };

        try {
            const response = await api.post(`/board/${board_id}/card`, payload);
            setLists(prevLists => prevLists.map(list => {
                if (list.id === listId) {
                    return {
                        ...list, cards: [...list.cards, response]};
                }
                return list;
            }));

            setIsCardModalOpen(false);

        } catch (error) {
            console.error("Помилка створення картки:", error);
        }
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
                <button className="add-list-btn" onClick={() => setIsListModalOpen(true)}>+ add new list</button>
                <button className="add-card-btn" onClick={() => setIsCardModalOpen(true)}>+ add new card</button>
            </div>

            <CreateListModal
                modalStatus={isListModalOpen}
                onClose={() => setIsListModalOpen(false)}
                onSubmit={handleCreateList}
            />

            <CreateCardModal modalStatus={isCardModalOpen} onClose={() => setIsCardModalOpen(false)} onSubmit={handleCreateCard} lists={lists}/>
        </div>
    );
}

export default Board;