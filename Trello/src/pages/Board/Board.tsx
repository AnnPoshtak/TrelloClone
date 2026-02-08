import { useState, useEffect } from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import type { IList } from "../../common/interfaces/IList.ts";
import type { IBoard } from "../../common/interfaces/IBoard.ts";
import List from "./components/List/List.tsx";
import CreateListModal from "./components/CreateListModal/CreateListModal.tsx";
import CreateCardModal from "./components/CreateCardModal/CreateCardModal.tsx";
import {deleteList} from "../../functions/DeleteList/DeleteList.ts"
import {deleteBoard} from "../../functions/DeleteBoard/DeleteBoard.ts";
import api from "../../api/request.ts";
import {editBoard} from "../../functions/EditBoard/EditBoard.ts";
import {editList} from "../../functions/EditList/EditList.ts";

function Board() {
    const { board_id } = useParams();
    const navigate = useNavigate()
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

    const handleListDelete = async (listId: number) => {
        await deleteList(board_id, listId);
        setLists(prevLists => prevLists.filter(list => list.id !== listId));
    };

    const handleBoardDelete = async (board_id: number) => {
        await deleteBoard(board_id)
        navigate('/');
    }

    const handleEditBoard = async () => {
        const newTitle = window.prompt("Enter new board title:", board.title);
        if (!newTitle || newTitle.trim() === "" || newTitle === board?.title) {
            return;
        }

        await editBoard(board_id, newTitle);
        if (board) {
            setBoard({ ...board, title: newTitle });
        }
    };

    const handleEditList = async (listId: number) => {
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

    if (!board) return <div>Завантаження...</div>;

    return (
        <div className="board">
            <div className="title">
                <h1>{`${board.title}(ID: ${board_id})`}</h1>
                <div className="control-btn">
                    <button onClick={() => handleBoardDelete(board_id)} className="delete-btn">❌</button>
                    <button className="edit-btn" onClick={() => handleEditBoard(board_id)}>✏️</button>
                </div>
            </div>

            <div className="lists-container">
                {lists.map((list) => (
                    <List
                        key={list.id}
                        id={list.id}
                        boardId={board_id}
                        title={list.title}
                        cards={list.cards}
                        onCardDelete={(cardId) => {
                            setLists(prevLists => prevLists.map(l => {
                                if (l.id === list.id) {
                                    return {
                                        ...l,
                                        cards: l.cards.filter(c => c.id !== cardId)
                                    };
                                }
                                return l;
                            }));
                        }}
                        onListDelete={handleListDelete}
                        onListEdit={handleEditList}
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

            <Link to={"/"} className={"home-btn"}>Home</Link>
        </div>
    );
}

export default Board;