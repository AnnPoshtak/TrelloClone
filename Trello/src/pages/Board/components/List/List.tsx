import type { Card } from "../../../../common/interfaces/Card.tsx";

interface ListProps {
    title: string;
    cards: Card[];
}

function List({ title, cards }: ListProps) {
    return (
        <div className="list">
            <h3>{title}</h3>
            <ul>
                {cards.map(card => (
                    <li key={card.id}>{card.title}</li>
                ))}
            </ul>
        </div>
    );
}
export default List;