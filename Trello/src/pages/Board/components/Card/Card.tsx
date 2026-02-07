import { deleteCard } from "../../../../functions/DeleteCard/DeleteCard.ts";

interface CardProps {
    title: string;
    cardId: number;
    boardId: number;
    onDelete: (cardId: number) => void;
}

function Card({ title, cardId, boardId, onDelete }: CardProps) {
    const handleDelete = async () => {
        await deleteCard(boardId, cardId);
        onDelete(cardId);
    };

    return (
        <div className="card">
            <span>{title}</span>
            <button className="delete-btn" onClick={handleDelete}>❌</button>
        </div>
    );
}

export default Card;