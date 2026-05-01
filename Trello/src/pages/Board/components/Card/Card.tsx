interface CardProps {
    title: string;
    cardId: number;
    onDelete: (cardId: number) => void;
    onEdit: (cardId: number) => void;
}

function Card({ title, cardId, onDelete, onEdit }: CardProps) {
    return (
        <div className="group flex items-center justify-between bg-white p-3 rounded shadow-sm border border-transparent hover:border-gray-300 hover:shadow-md transition-all cursor-pointer">
            
            {/* Текст картки з динамічним підкресленням, як було у твоєму CSS */}
            <span className="text-[#172b4d] font-medium truncate decoration-[var(--board-color)] decoration-2 underline-offset-4 group-hover:underline">
                {title}
            </span>

            {/* Контроли: з'являються при наведенні (opacity-0 -> group-hover:opacity-100) */}
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                    onClick={(e) => {
                        e.stopPropagation(); // щоб не спрацював клік по самій картці
                        onEdit(cardId);
                    }}
                    className="p-1 hover:bg-blue-50 rounded text-sm transition-colors"
                    title="Edit"
                >
                    ✏️
                </button>
                <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(cardId);
                    }}
                    className="p-1 hover:bg-red-50 rounded text-sm transition-colors"
                    title="Delete"
                >
                    ❌
                </button>
            </div>
        </div>
    );
}

export default Card;