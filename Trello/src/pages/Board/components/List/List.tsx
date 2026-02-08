import type { ICard } from "../../../../common/interfaces/ICard.ts";
import CardComponent from "../Card/Card.tsx";

interface ListProps{
    boardId: number;
    onCardDelete: (cardId: number) => void;
    onListDelete: (listId: number) => void;
    onListEdit: (listId: number) => void;
    title: string;
    cards: ICard[];
    id: number
}

function List({ title, cards, boardId, onCardDelete, onListDelete, onListEdit, id }: ListProps) {
    return (
        <div className={"list_class"}>
            <div className={"list-header"}>
                <div className="list__title">
                    <span>{title}</span>
                    <button className="delete-btn" onClick={() => onListDelete(id)}>❌</button>
                    <button className="edit-btn" onClick={() => onListEdit(id)}>✏️</button>
                </div>
            </div>

            <div className="list__cards">
                {cards?.map(card => (
                    <CardComponent
                        key={card.id}
                        cardId={card.id}
                        boardId={boardId}
                        title={card.title}
                        onDelete={onCardDelete}
                    />
                ))}
            </div>
        </div>
    );
}

export default List;