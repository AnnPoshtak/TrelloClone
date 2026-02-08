import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import type { IList } from "../../common/interfaces/IList.ts";
import type { IBoard } from "../../common/interfaces/IBoard.ts";
import List from "./components/List/List.tsx";
import CreateListModal from "./components/CreateListModal/CreateListModal.tsx";
import CreateCardModal from "./components/CreateCardModal/CreateCardModal.tsx";
import { deleteList } from "../../functions/DeleteList/DeleteList.ts";
import { deleteBoard } from "../../functions/DeleteBoard/DeleteBoard.ts";
import { deleteCard } from "../../functions/DeleteCard/DeleteCard.ts";
import api from "../../api/request.ts";
import { editBoard } from "../../functions/EditBoard/EditBoard.ts";
import { editList } from "../../functions/EditList/EditList.ts";
import { editCard } from "../../functions/EditCard/EditCard.ts";

function Board() {
    const { board_id } = useParams();
    const navigate = useNavigate();
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
        if (!board_id) return;
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
        if (!board_id) return;
        const targetList = lists.find(list => list.id === listId);
        if (!targetList) return;

        const newPosition = targetList.cards.length + 1;

        const load = {
            title: title,
            list_id: listId,
            position: newPosition,
            description: "",
        };

        const response = await api.post(`/board/${board_id}/card`, load);
        const serverData = response.data || response;
        const newCard = {
            ...load,
            ...serverData,
        };
        setLists(prevLists => prevLists.map(list => {
            if (list.id === listId) {
                return {
                    ...list,
                    cards: [...list.cards, newCard]
                };
            }
            return list;
        }));
        setIsCardModalOpen(false);
    }

    const handleCardDelete = async (listId: number, cardId: number) => {
        if (!board_id) return;
        await deleteCard(board_id, cardId);

        setLists(prevLists => prevLists.map(l => {
            if (l.id === listId) {
                return {
                    ...l,
                    cards: l.cards.filter(c => c.id !== cardId)
                };
            }
            return l;
        }));
    };

    const handleListDelete = async (listId: number) => {
        if (!board_id) return;
        await deleteList(board_id, listId);
        setLists(prevLists => prevLists.filter(list => list.id !== listId));
    };

    const handleBoardDelete = async () => {
        if (!board_id) return;
        await deleteBoard(board_id);
        navigate('/');
    }

    const handleEditBoard = async () => {
        if (!board_id || !board) return;
        const newTitle = window.prompt("Enter new board title:", board.title);
        if (!newTitle || newTitle.trim() === "" || newTitle === board.title) {
            return;
        }

        await editBoard(board_id, newTitle);
        setBoard({ ...board, title: newTitle });
    };

    const handleEditList = async (listId: number) => {
        if (!board_id) return;
        const currentList = lists.find(l => l.id === listId);
        const currentTitle = currentList ? currentList.title : "";

        const newTitle = window.prompt("Enter new list title:", currentTitle);

        if (!newTitle || newTitle.trim() === "" || newTitle === currentTitle) {
            return;
        }
        await editList(board_id, listId, newTitle);
        setLists(prevLists => prevLists.map(list => {
            if (list.id === listId) {
                return { ...list, title: newTitle };
            }
            return list;
        }));
    }

    const handleEditCard = async (listId: number, cardId: number) => {
        if (!board_id) return;
        const list = lists.find(l => l.id === listId);
        const card = list?.cards.find(c => c.id === cardId);

        if (!card) return;

        const newTitle = window.prompt("New title:", card.title);

        if (!newTitle || newTitle.trim() === "" || newTitle === card.title) return;

        const load = {
            title: newTitle,
            list_id: listId,
            position: card.position,
            description: card.description
        };
        await editCard(board_id, cardId, load);

        setLists(prevLists => prevLists.map(currentList => {
            if (currentList.id === listId) {
                return {
                    ...currentList,
                    cards: currentList.cards.map(c => {
                        if (c.id === cardId) {
                            return { ...c, title: newTitle };
                        }
                        return c;
                    })
                };
            }
            return currentList;
        }));
    };

    if (!board) return <div>Завантаження...</div>;

    return (
        <div className="board">
            <div className="title">
                <h1>{`${board.title} (ID: ${board_id})`}</h1>
                <div className="control-btn">
                    <button onClick={handleBoardDelete} className="delete-btn">❌</button>
                    <button className="edit-btn" onClick={handleEditBoard}>✏️</button>
                </div>
            </div>

            <div className="lists-container">
                {lists.map((list) => (
                    <List
                        key={list.id}
                        id={list.id}
                        boardId={board_id!}
                        title={list.title}
                        cards={list.cards}
                        onCardDelete={(cardId) => handleCardDelete(list.id, cardId)}
                        onListDelete={handleListDelete}
                        onListEdit={handleEditList}
                        onCardEdit={(cardId) => handleEditCard(list.id, cardId)}
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

            <CreateCardModal
                modalStatus={isCardModalOpen}
                onClose={() => setIsCardModalOpen(false)}
                onSubmit={handleCreateCard}
                lists={lists}
            />

            <Link to={"/"} className={"home-btn"}>Home</Link>
        </div>
    );
}

export default Board;