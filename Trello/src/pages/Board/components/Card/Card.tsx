interface CardProps {
    title: string;
    cardId: number;
    onDelete: (cardId: number) => void;
    onEdit: (cardId: number) => void;
}

function Card({ title, cardId, onDelete, onEdit }: CardProps) {
    return (
        <div className="card">
            <span>{title}</span>
            <div className="card-controls">
                <button className="delete-btn" onClick={() => onDelete(cardId)}>❌</button>
                <button className="edit-btn" onClick={() => onEdit(cardId)}>✏️</button>
            </div>
        </div>
    );
}

export default Card;