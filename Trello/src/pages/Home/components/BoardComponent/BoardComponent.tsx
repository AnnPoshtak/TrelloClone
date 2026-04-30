import { Link } from "react-router-dom";
import type { IBoard } from "../../../../common/interfaces/IBoard.ts";

interface BoardComponentProps {
    title: string;
    custom: IBoard['custom'];
    board: IBoard;
}

function BoardComponent({ board }: BoardComponentProps) {
    const boardColor = board.custom?.background || '#6366f1'; 
    return (
        <Link key={board.id} to={`/board/${board.id}`} className="no-underline block">
            <div className="w-[200px] h-[100px] rounded-lg text-white flex items-center justify-center font-bold transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5"style={{ backgroundColor: boardColor }}>
                {board.title}
            </div>
        </Link>
    );
}

export default BoardComponent;