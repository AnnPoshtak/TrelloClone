import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import List from "./components/List/List.tsx";
import { useBoard } from "../../hooks/useBoard/useBoard.tsx";
import { useList } from "../../hooks/useList/useList.tsx";
import { useCard } from "../../hooks/useCard/useCard.tsx";
import CreateModal from "../../components/CreateModal/CreateModal.tsx";
import EditModal from "../../components/EditModal/EditModal.tsx";
import type { IList } from "../../common/interfaces/IList.ts";

interface IEditingList { id: number; title: string; }
interface IEditingCard { listId: number; id: number; title: string; cardData: any; }

function Board() {
    const { board_id } = useParams();
    
    const [isListCreateModalOpen, setIsListCreateModalOpen] = useState(false);
    const [isCardCreateModalOpen, setIsCardCreateModalOpen] = useState(false);
    const [editingList, setEditingList] = useState<IEditingList | null>(null);
    const [editingCard, setEditingCard] = useState<IEditingCard | null>(null);
    const [isBoardEditModalOpen, setIsBoardEditModalOpen] = useState(false);

    const { board, lists, isLoading, isError, handleBoardDelete, handleEditBoard } = useBoard(board_id);
    const { handleCreateList, handleListDelete, handleEditList } = useList(board_id, lists);
    const { handleCreateCard, handleCardDelete, handleEditCard, handleCardMove } = useCard(board_id, lists);

    if (isLoading) return <div>Loading...</div>;
    if (isError || !board) return <div>Error</div>; 

    const boardColor = board.custom?.background 
        || (Array.isArray(board.custom) && board.custom[0]?.background) 
        || "#6366f1";

    return (
        <div className="board" style={{ "--board-color": boardColor } as React.CSSProperties}>
            <div className="title">
                <h1>{board.title}</h1>
                <div className="title-actions">
                    <button onClick={handleBoardDelete} className="delete-btn">Delete</button>
                    <button onClick={() => setIsBoardEditModalOpen(true)} className="edit-btn">Edit</button>
                    <button className="add-list-btn" onClick={() => setIsListCreateModalOpen(true)}>+ List</button>
                    <button className="add-card-btn" onClick={() => setIsCardCreateModalOpen(true)}>+ Card</button>
                </div>
            </div>

            <div className="lists-container">
                {lists.map((list: IList) => (
                    <List
                        key={list.id}
                        id={list.id}
                        boardId={board_id!}
                        title={list.title}
                        cards={list.cards}
                        onCardDelete={(cardId) => handleCardDelete(list.id, cardId)}
                        onListDelete={handleListDelete}
                        onListEdit={() => setEditingList({ id: list.id, title: list.title })}
                        onCardEdit={(cardId) => {
                            const currentCard = list.cards.find(c => c.id === cardId);
                            if (currentCard) {
                                setEditingCard({ 
                                    listId: list.id, 
                                    id: cardId, 
                                    title: currentCard.title, 
                                    cardData: currentCard 
                                });
                            }
                        }}
                        onCardMove={handleCardMove}
                    />
                ))}
            </div>
            <Link to={"/"} className="home-btn">← Home</Link>
            

            <CreateModal
                modalStatus={isListCreateModalOpen}
                onClose={() => setIsListCreateModalOpen(false)}
                modalTitle="New list"
                placeholder="Title"
                onSubmit={({ text }) => handleCreateList(text, () => setIsListCreateModalOpen(false))}
            />

            <CreateModal
                modalStatus={isCardCreateModalOpen}
                onClose={() => setIsCardCreateModalOpen(false)}
                modalTitle="New card"
                placeholder="Text"
                lists={lists}
                onSubmit={({ text, listId }) => handleCreateCard(text, listId!, () => setIsCardCreateModalOpen(false))}
            />

            <EditModal
                modalStatus={!!editingList}
                onClose={() => setEditingList(null)}
                modalTitle="Edit List"
                placeholder="Title"
                initialText={editingList?.title || ""}
                onSubmit={({ text }) => {
                    if (editingList) {
                        handleEditList(editingList.id, text);
                        setEditingList(null);
                    }
                }}
            />

            <EditModal
                modalStatus={!!editingCard}
                onClose={() => setEditingCard(null)}
                modalTitle="Edit Card"
                placeholder="Text"
                initialText={editingCard?.title || ""}
                onSubmit={({ text }) => {
                    if (editingCard) {
                        handleEditCard(editingCard.listId, editingCard.id, text, editingCard.cardData);
                        setEditingCard(null);
                    }
                }}
            />

            <EditModal
                modalStatus={isBoardEditModalOpen}
                onClose={() => setIsBoardEditModalOpen(false)}
                modalTitle="Edit Board"
                placeholder="Title"
                initialText={board.title}
                onSubmit={({ text }) => {
                    handleEditBoard(text);
                    setIsBoardEditModalOpen(false);
                }}
            />

            
        </div>
    );
}

export default Board;