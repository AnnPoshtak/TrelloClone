import { Pencil, Trash2 } from "lucide-react";

interface CardProps {
    title: string;
    cardId: number;
    onDelete: (cardId: number) => void;
    onEdit: (cardId: number) => void;
}

function Card({ title, cardId, onDelete, onEdit }: CardProps) {
    return (
        <div className="group flex items-center justify-between bg-white/70 backdrop-blur-sm p-3.5 rounded-xl shadow-sm border border-white/60 hover:border-white hover:bg-white hover:shadow-md transition-all cursor-grab active:cursor-grabbing">
            
            <span className="text-gray-800 font-medium truncate">
                {title}
            </span>


            <div className="flex gap-1">
                <button 
                    onClick={(e) => {
                        e.stopPropagation(); 
                        onEdit(cardId);
                    }}
                    className="p-1.5 hover:bg-blue-50/80 text-gray-400 hover:text-blue-500 rounded-lg transition-all"
                    title="Edit"
                    aria-label="Edit card"
                >
                    <Pencil strokeWidth={2} size={16} />
                </button>
                <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(cardId);
                    }}
                    className="p-1.5 hover:bg-red-50/80 text-gray-400 hover:text-red-500 rounded-lg transition-all"
                    title="Delete"
                    aria-label="Delete card"
                >
                    <Trash2 strokeWidth={2} size={16} />
                </button>
            </div>
        </div>
    );
}

export default Card;