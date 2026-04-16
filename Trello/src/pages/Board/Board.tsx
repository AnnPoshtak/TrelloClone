import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import List from "./components/List/List.tsx";
import { useBoard } from "../../hooks/UseBoard/UseBoard.tsx";
import { useList } from "../../hooks/UseList/UseList.tsx";
import { useCard } from "../../hooks/UseCard/UseCard.tsx";
import CreateModal from "../../components/CreateModal/CreateModal.tsx";
import EditModal from "../../components/EditModal/EditModal.tsx";

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
    if (isError || !board) return <div>Error loading board data</div>; 

    return (
        <div className="board">
            <div className="title">
                <h1>{`${board.title} (ID: ${board_id})`}</h1>
                <div className="control-btn">
                    <button onClick={handleBoardDelete} className="delete-btn">❌</button>
                    <button className="edit-btn" onClick={() => setIsBoardEditModalOpen(true)}>✏️</button>
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

                <button className="add-list-btn" onClick={() => setIsListCreateModalOpen(true)}>+ add new list</button>
                <button className="add-card-btn" onClick={() => setIsCardCreateModalOpen(true)}>+ add new card</button>
            </div>

            <CreateModal
                modalStatus={isListCreateModalOpen}
                onClose={() => setIsListCreateModalOpen(false)}
                modalTitle="Create new list"
                placeholder="List Title"
                onSubmit={({ text }) => handleCreateList(text, () => setIsListCreateModalOpen(false))}
            />

            <CreateModal
                modalStatus={isCardCreateModalOpen}
                onClose={() => setIsCardCreateModalOpen(false)}
                modalTitle="Create new card"
                placeholder="Card Text"
                lists={lists}
                onSubmit={({ text, listId }) => handleCreateCard(text, listId!, () => setIsCardCreateModalOpen(false))}
            />

            <EditModal
                modalStatus={!!editingList}
                onClose={() => setEditingList(null)}
                modalTitle="Edit List"
                placeholder="List Title"
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
                placeholder="Card Text"
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
                placeholder="Board Title"
                initialText={board.title}
                onSubmit={({ text }) => {
                    handleEditBoard(text);
                    setIsBoardEditModalOpen(false);
                }}
            />

            <Link to={"/"} className={"home-btn"}>Home</Link>
        </div>
    );
}

export default Board;