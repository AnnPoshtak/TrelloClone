import { Link } from "react-router-dom";
import type { IBoard } from "../../../../common/interfaces/IBoard.ts";
interface BoardComponentProps {
    title: string;
    custom: IBoard['custom'];
    board: IBoard;
}

function BoardComponent({ board }: BoardComponentProps) {
    const boardColor = board.custom?.background 
    return (
        <Link key={board.id} to={`/board/${board.id}`} style={{ textDecoration: 'none' }}>
            <div className="board-card" style={{ "--board-color": boardColor } as React.CSSProperties}>
                {board.title}
            </div>
        </Link>
    );
}

export default BoardComponent;