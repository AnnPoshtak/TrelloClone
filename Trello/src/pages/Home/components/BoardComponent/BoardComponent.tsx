import type { IBoard } from "../../../../common/interfaces/IBoard.ts";
interface BoardComponentProps {
    title: string;
    custom: IBoard['custom'];
}

function BoardComponent({ title, custom }: BoardComponentProps) {
    return (
        <button className="board-card" style={{ backgroundColor: custom.background }}>
            {title}
        </button>
    );
}

export default BoardComponent;