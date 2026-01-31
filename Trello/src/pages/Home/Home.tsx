import { useState } from "react";
import { Link } from "react-router-dom";
import type { IBoard } from "../../common/interfaces/IBoard.ts"
import BoardComponent from "./components/BoardComponent/BoardComponent.tsx";

function Home () {
    const [boards, setBoards] = useState<IBoard[]>(
        [
            {id: 1, title: "покупки", custom: {background: "red"}},
            {id: 2, title: "підготовка до весілля", custom: {background: "green"}},
            {id: 3, title: "розробка інтернет-магазину", custom: {background: "blue"}},
            {id: 4, title: "курс по просуванню у соцмережах", custom: {background: "grey"}}
        ]
    );

    return (
        <>
            <h1 className="title">Your boards</h1>
            <div className="board-container">
                {boards.map((board) => (
                    <Link key={board.id} to={`/board/${board.id}`}>
                        <BoardComponent
                            title={board.title}
                            custom={board.custom}
                        />
                    </Link>
                ))}
            </div>
            <button className="add-board-btn">+ add new board</button>
        </>
    )
}

export default Home;