import type { ICard } from "@/common/interfaces/ICard.ts";
import CardComponent from "../Card/Card.tsx";
import React from "react"
import { Pencil, Trash2 } from "lucide-react";

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
        <div 
            className="min-w-[300px] w-[300px] bg-white/40 backdrop-blur-md border border-white/50 rounded-2xl p-4 flex flex-col h-fit max-h-full shadow-[0_4px_16px_rgba(0,0,0,0.04)]" 
            onDragOver={dragOver} 
            onDrop={dragDrop}
        >
            <div className="flex items-center justify-between mb-4 px-1">
                <span className="font-bold text-gray-800 text-lg truncate pr-2">{title}</span>
                <div className="flex gap-1.5 shrink-0">
                    <button 
                        className="p-1.5 text-gray-400 hover:bg-white/60 hover:text-blue-600 rounded-lg transition-all" 
                        onClick={() => onListEdit(id)}
                        title="Edit list"
                    >
                        <Pencil strokeWidth={2} size={16} />
                    </button>
                    <button 
                        className="p-1.5 text-gray-400 hover:bg-white/60 hover:text-red-500 rounded-lg transition-all" 
                        onClick={() => onListDelete(id)}
                        title="Delete list"
                    >
                        <Trash2 strokeWidth={2} size={16} />
                    </button>
                </div>
            </div>

            <div className="flex flex-col gap-3 min-h-[50px] rounded-xl transition-colors">
                {cards.map(card => (
                    <div 
                        key={card.id} 
                        draggable={true} 
                        onDragStart={(e) => dragStart(e, card.id)}
                    >
                        <CardComponent
                            cardId={card.id}
                            title={card.title}
                            onDelete={onCardDelete}
                            onEdit={onCardEdit}
                        />
                    </div>
                ))}
                
                {cards.length === 0 && (
                    <div className="text-gray-500/70 font-medium text-sm text-center py-6 border-2 border-dashed border-white/60 rounded-xl bg-white/20">
                        Перетягніть картки сюди
                    </div>
                )}
            </div>
        </div>
    );
}

export default List;