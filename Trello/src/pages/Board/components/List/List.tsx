import type { IList } from "../../../../common/interfaces/IList.ts";
import CardComponent from "../Card/Card.tsx";

interface ListProps extends IList {
    boardId: number;
    onCardDelete: (cardId: number) => void;
    onListDelete: (listId: number) => void; // ✅ Ти це додала, супер
}

function List({ title, cards, boardId, onCardDelete, onListDelete, id }: ListProps) {
    return (
        <div className={"list_class"}>

            <div className={"list-header"}>
                <div className="list__title">
                    <span>{title}</span>
                    <button
                        className="delete-btn"
                        onClick={() => onListDelete(id)}
                    >
                        ❌
                    </button>
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