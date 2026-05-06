import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import List from "./components/List/List.tsx";
import { useBoard } from "@/hooks/useBoard/useBoard.tsx";
import { useList } from "@/hooks/useList/useList.tsx";
import { useCard } from "@/hooks/useCard/useCard.tsx";
import CreateModal from "@/components/CreateModal/CreateModal.tsx";
import EditModal from "@/components/EditModal/EditModal.tsx";
import type { IList } from "@/common/interfaces/IList.ts";
import type { IBoard } from "@/common/interfaces/IBoard.ts";
import { themeSettings } from "@/ThemeSettings.ts";

function Board() {
    const { board_id } = useParams();
    
    const [isListCreateModalOpen, setIsListCreateModalOpen] = useState(false);
    const [isCardCreateModalOpen, setIsCardCreateModalOpen] = useState(false);
    const [editingList, setEditingList] = useState<{ id: number; title: string } | null>(null);
    const [editingCard, setEditingCard] = useState<any>(null);
    const [isBoardEditModalOpen, setIsBoardEditModalOpen] = useState(false);
    
    const [themeStatus] = useState(() => {
        return localStorage.getItem("trello_theme") || "Небесна";
    });

    const currentTheme = themeSettings[themeStatus as keyof typeof themeSettings] || themeSettings["Небесна"];

    const { board, lists, isLoading, isError, handleBoardDelete, handleEditBoard } = useBoard(board_id);
    const { handleCreateList, handleListDelete, handleEditList } = useList(board_id, lists);
    const { handleCreateCard, handleCardDelete, handleEditCard, handleCardMove } = useCard(board_id, lists);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen w-full">
                <div className={`${currentTheme.text} text-[10px] w-[1em] h-[1em] rounded-full relative indent-[-9999em] [transform:translateZ(0)] custom-loader-anim`}>
                    Loading...
                </div>
            </div>
        );
    }

    if (isError || !board) {
        return (
            <div className="flex flex-col items-center justify-center h-screen gap-4">
                <div className="text-red-500 text-xl font-medium">Error loading board</div>
                <Link to="/" className="text-blue-500 underline">Повернутися на головну</Link>
            </div>
        );
    }

    const currentBoard = board as unknown as IBoard;

    return (
        <div className={`min-h-screen flex flex-col bg-linear-to-br ${currentTheme.bg} transition-colors duration-700 font-sans relative overflow-hidden`}>
            <header className="flex justify-between items-center w-full p-8 relative z-10 shrink-0">
                <Link 
                    to="/" 
                    className="bg-white/80 backdrop-blur-md text-gray-800 px-6 py-2.5 rounded-xl font-medium hover:bg-white transition-all shadow-sm border border-white/50 flex items-center gap-2"
                >
                    ← Дошки
                </Link>

                <div className="bg-white/70 backdrop-blur-xl px-8 py-3 rounded-2xl shadow-sm border border-white/60 flex flex-wrap justify-center items-center gap-6">
                    <h1 className="text-2xl font-bold text-gray-800">{currentBoard.title}</h1>
                    
                    <div className="flex gap-3 border-l border-gray-300/50 pl-6">
                        <button 
                            onClick={handleBoardDelete} 
                            className="px-4 py-2 bg-red-100/60 text-red-600 border border-red-200/50 rounded-xl font-medium hover:bg-red-100 transition-colors shadow-sm"
                        >
                            Видалити
                        </button>
                        <button 
                            onClick={() => setIsBoardEditModalOpen(true)} 
                            className="px-4 py-2 bg-orange-100/60 text-orange-700 border border-orange-200/50 rounded-xl font-medium hover:bg-orange-100 transition-colors shadow-sm"
                        >
                            Редагувати
                        </button>
                        <button 
                            onClick={() => setIsListCreateModalOpen(true)}
                            className={`${currentTheme.btn} text-white border border-white/20 px-4 py-2 rounded-xl font-medium hover:opacity-90 transition-all shadow-md`}
                        >
                            + Список
                        </button>
                        <button 
                            onClick={() => setIsCardCreateModalOpen(true)}
                            className={`${currentTheme.btn} text-white border border-white/20 px-4 py-2 rounded-xl font-medium hover:opacity-90 transition-all shadow-md`}
                        >
                            + Картка
                        </button>
                    </div>
                </div>
                <div className="w-30 hidden md:block"></div>
            </header>

            <main className="flex-1 overflow-x-auto overflow-y-hidden px-8 pb-8 flex items-start gap-6">
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
            </main>

            <CreateModal modalStatus={isListCreateModalOpen} onClose={() => setIsListCreateModalOpen(false)} modalTitle="Новий список" placeholder="Title" onSubmit={({ text }) => handleCreateList(text, () => setIsListCreateModalOpen(false))} />
            <CreateModal modalStatus={isCardCreateModalOpen} onClose={() => setIsCardCreateModalOpen(false)} modalTitle="Нова картка" placeholder="Text" lists={lists} onSubmit={({ text, listId }) => handleCreateCard(text, listId!, () => setIsCardCreateModalOpen(false))} />
            <EditModal modalStatus={!!editingList} onClose={() => setEditingList(null)} modalTitle="Редагувати список" placeholder="Title" initialText={editingList?.title || ""} onSubmit={({ text }) => { if (editingList) { handleEditList(editingList.id, text); setEditingList(null); } }} />
            <EditModal modalStatus={!!editingCard} onClose={() => setEditingCard(null)} modalTitle="Редагувати картку" placeholder="Text" initialText={editingCard?.title || ""} onSubmit={({ text }) => { if (editingCard) { handleEditCard(editingCard.listId, editingCard.id, text, editingCard.cardData); setEditingCard(null); } }} />
            <EditModal modalStatus={isBoardEditModalOpen} onClose={() => setIsBoardEditModalOpen(false)} modalTitle="Редагувати дошку" placeholder="Title" initialText={currentBoard.title} onSubmit={({ text }) => { handleEditBoard(text); setIsBoardEditModalOpen(false); }} />
        </div>
    );
}

export default Board;