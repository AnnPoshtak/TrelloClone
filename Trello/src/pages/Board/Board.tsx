import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import List from "./components/List/List.tsx";
import { useBoard } from "../../hooks/useBoard/useBoard.tsx";
import { useList } from "../../hooks/useList/useList.tsx";
import { useCard } from "../../hooks/useCard/useCard.tsx";
import CreateModal from "../../components/CreateModal/CreateModal.tsx";
import EditModal from "../../components/EditModal/EditModal.tsx";
import type { IList } from "../../common/interfaces/IList.ts";

function Board() {
    const { board_id } = useParams();
    
    const [isListCreateModalOpen, setIsListCreateModalOpen] = useState(false);
    const [isCardCreateModalOpen, setIsCardCreateModalOpen] = useState(false);
    const [editingList, setEditingList] = useState<{ id: number; title: string } | null>(null);
    const [editingCard, setEditingCard] = useState<any>(null);
    const [isBoardEditModalOpen, setIsBoardEditModalOpen] = useState(false);

    const { board, lists, isLoading, isError, handleBoardDelete, handleEditBoard } = useBoard(board_id);
    const { handleCreateList, handleListDelete, handleEditList } = useList(board_id, lists);
    const { handleCreateCard, handleCardDelete, handleEditCard, handleCardMove } = useCard(board_id, lists);

    if (isLoading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
    if (isError || !board) return <div className="text-red-500 text-center mt-10">Error loading board</div>; 

    const boardColor = board.custom?.background 
        || (Array.isArray(board.custom) && board.custom[0]?.background) 
        || "#6366f1";

    return (
        <div className="min-h-screen bg-[#f4f5f7] text-[#172b4d] relative"style={{ "--board-color": boardColor } as React.CSSProperties}>
            <Link to="/" className="absolute top-10 left-5 text-[#0052cc] font-bold hover:underline">← Home</Link>
            <div className="flex flex-col items-center py-10 px-5">
                <h1 className="text-[3rem] font-bold mb-[15px]">{board.title}</h1>
                <div className="flex gap-2.5">
                    <button 
                        onClick={handleBoardDelete} 
                        className="px-4 py-2 bg-[#ffebee] text-[#c62828] border border-[#ef9a9a] rounded font-medium hover:bg-[#ffcdd2] transition-colors"
                    >
                        Delete
                    </button>
                    <button 
                        onClick={() => setIsBoardEditModalOpen(true)} 
                        className="px-4 py-2 bg-[#e3f2fd] text-[#1565c0] border border-[#90caf9] rounded font-medium hover:bg-[#bbdefb] transition-colors"
                    >
                        Edit
                    </button>
                    <button 
                        onClick={() => setIsListCreateModalOpen(true)}
                        className="px-4 py-2 bg-[#fdf7e3] text-[#c09015] border border-[#a7a700] rounded font-medium hover:bg-[#f9f0c8] transition-colors"
                    >
                        + List
                    </button>
                    <button 
                        onClick={() => setIsCardCreateModalOpen(true)}
                        className="px-4 py-2 bg-[#fdf7e3] text-[#c09015] border border-[#a7a700] rounded font-medium hover:bg-[#f9f0c8] transition-colors"
                    >
                        + Card
                    </button>
                </div>
            </div>

            <div className="flex items-start gap-4 p-5 overflow-x-auto h-[calc(100vh-200px)]">
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