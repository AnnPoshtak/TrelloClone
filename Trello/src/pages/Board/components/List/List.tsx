import type { ICard } from "../../../../common/interfaces/ICard.ts";
import CardComponent from "../Card/Card.tsx";
import React from "react"

interface ListProps {
    id: number;
    boardId: string;
    title: string;
    cards: ICard[];
    onListDelete: (listId: number) => void;
    onListEdit: (listId: number) => void;
    onCardDelete: (cardId: number) => void;
    onCardEdit: (cardId: number) => void;
    onCardMove: (cardId: number, currentListId: number, newListId: number) => void;
}

function List({title, cards, id, onCardDelete, onListDelete, onListEdit, onCardEdit, onCardMove}: ListProps) {
    function dragStart(e: React.DragEvent, cardId: number) {
        e.dataTransfer.setData("cardId", cardId.toString());
        e.dataTransfer.setData("currentListId", id.toString());
    }

    function dragOver (e: React.DragEvent) {
        e.preventDefault();
    }

    function dragDrop(e: React.DragEvent){
        e.preventDefault();
        let cardId = Number(e.dataTransfer.getData("cardId"));
        let currentListId = Number(e.dataTransfer.getData("currentListId"));
        onCardMove(cardId, currentListId, id);
    }

    return (
        /* min-w-[272px] — стандартна ширина колонки Trello. h-fit — щоб колонка не розтягувалася без потреби */
        <div 
            className="min-w-[272px] w-[272px] bg-[#ebecf0] rounded-lg p-3 flex flex-col h-fit max-h-full shadow-sm" 
            onDragOver={dragOver} 
            onDrop={dragDrop}
        >
            {/* Заголовок списку */}
            <div className="flex items-center justify-between mb-3 px-1">
                <span className="font-bold text-[#172b4d] truncate pr-2">{title}</span>
                <div className="flex gap-1 shrink-0">
                    <button 
                        className="p-1.5 bg-[#ffebee] text-[#c62828] border border-[#ef9a9a] rounded hover:bg-[#ffcdd2] transition-colors text-xs" 
                        onClick={() => onListDelete(id)}
                        title="Delete list"
                    >
                        ❌
                    </button>
                    <button 
                        className="p-1.5 bg-white text-[#1565c0] border border-[#90caf9] rounded hover:bg-gray-50 transition-colors text-xs" 
                        onClick={() => onListEdit(id)}
                        title="Edit list"
                    >
                        ✏️
                    </button>
                </div>
            </div>

            {/* Контейнер для карток */}
            <div className="flex flex-col gap-2 bg-[#dfe1e6]/50 min-h-[100px] p-2 rounded-md transition-colors">
                {cards.map(card => (
                    <div 
                        key={card.id} 
                        draggable={true} 
                        onDragStart={(e) => dragStart(e, card.id)}
                        className="active:cursor-grabbing"
                    >
                        <CardComponent
                            cardId={card.id}
                            title={card.title}
                            onDelete={onCardDelete}
                            onEdit={onCardEdit}
                        />
                    </div>
                ))}
                
                {/* Якщо карток немає, можна додати підказку або просто пусте місце */}
                {cards.length === 0 && (
                    <div className="text-gray-400 text-xs text-center py-4 border-2 border-dashed border-gray-300 rounded">
                        Drop cards here
                    </div>
                )}
            </div>
        </div>
    );
}

export default List;