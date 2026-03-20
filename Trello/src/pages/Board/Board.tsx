import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import List from "./components/List/List.tsx";
import CreateListModal from "./components/CreateListModal/CreateListModal.tsx";
import CreateCardModal from "./components/CreateCardModal/CreateCardModal.tsx";

import { useBoard } from "../../hooks/useBoard/UseBoard.tsx";
import { useList } from "../../hooks/useList/UseList.tsx";
import { useCard } from "../../hooks/useCard/UseCard.tsx";

function Board() {
    const { board_id } = useParams();
    const [isListModalOpen, setIsListModalOpen] = useState(false);
    const [isCardModalOpen, setIsCardModalOpen] = useState(false);

    const { board, lists, isLoading, isError, handleBoardDelete, handleEditBoard } = useBoard(board_id);
    const { handleCreateList, handleListDelete, handleEditList } = useList(board_id, lists);
    const { handleCreateCard, handleCardDelete, handleEditCard, handleCardMove } = useCard(board_id, lists);

    if (isLoading) return <div>Loading...</div>;
    if (isError || !board) return <div>Error loading board data</div>; 

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
                        onCardMove={handleCardMove}
                    />
                ))}

                <button className="add-list-btn" onClick={() => setIsListModalOpen(true)}>+ add new list</button>
                <button className="add-card-btn" onClick={() => setIsCardModalOpen(true)}>+ add new card</button>
            </div>

            <CreateListModal
                modalStatus={isListModalOpen}
                onClose={() => setIsListModalOpen(false)}
                onSubmit={(title) => handleCreateList(title, () => setIsListModalOpen(false))}
            />

            <CreateCardModal
                modalStatus={isCardModalOpen}
                onClose={() => setIsCardModalOpen(false)}
                onSubmit={(title, listId) => handleCreateCard(title, listId, () => setIsCardModalOpen(false))}
                lists={lists}
            />

            <Link to={"/"} className={"home-btn"}>Home</Link>
        </div>
    );
}

export default Board;