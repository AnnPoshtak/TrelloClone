import type { ICard } from "../../../../common/interfaces/ICard.ts";
import CardComponent from "../Card/Card.tsx";

interface ListProps {
    id: number;
    boardId: number;
    title: string;
    cards: ICard[];
    onListDelete: (listId: number) => void;
    onListEdit: (listId: number) => void;
    onCardDelete: (cardId: number) => void;
    onCardEdit: (cardId: number) => void;
}

function List({title, cards, boardId, id, onCardDelete, onListDelete, onListEdit, onCardEdit}: ListProps) {
    return (
        <div className="list_class">
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
                    <CardComponent
                        key={card.id}
                        cardId={card.id}
                        title={card.title}
                        onDelete={onCardDelete}
                        onEdit={onCardEdit}
                    />
                ))}
            </div>
        </div>
    );
}

export default List;