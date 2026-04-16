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
    function DragStart(e: React.DragEvent, cardId: number) {
        e.dataTransfer.setData("cardId", cardId.toString());
        e.dataTransfer.setData("currentListId", id.toString());
    }
    function DragOver (e: React.DragEvent) {
        e.preventDefault();
    }

    function DragDrop(e: React.DragEvent){
        e.preventDefault();
        let cardId = Number(e.dataTransfer.getData("cardId"));
        let currentListId = Number(e.dataTransfer.getData("currentListId"));
        onCardMove(cardId, currentListId, id);
    }

    return (
        <div className="list_class" onDragOver={DragOver} onDrop={DragDrop}>
            <div className="list-header">
                <div className="list__title">
                    <span>{title}</span>
                    <div className="list-controls">
                        <button className="delete-btn" onClick={() => onListDelete(id)}>❌</button>
                        <button className="edit-btn" onClick={() => onListEdit(id)}>✏️</button>
                    </div>
                </div>
            </div>

            <div className="list__cards">
                {cards.map(card => (
                    <div key={card.id} draggable={true} onDragStart={(e) => DragStart(e, card.id)}>
                        <CardComponent
                            key={card.id}
                            cardId={card.id}
                            title={card.title}
                            onDelete={onCardDelete}
                            onEdit={onCardEdit}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default List;