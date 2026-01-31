import { useState } from "react";
import { useParams } from "react-router-dom";
import type { IList } from "../../common/interfaces/IList.ts"
import List from "./components/List/List.tsx";

function Board() {
    const { board_id } = useParams();

    const [title, setTitle] = useState<string>("Моя тестова дошка");

    const [lists, setLists] = useState<IList[]>([
        {
            id: 1,
            title: "Плани",
            cards: [
                { id: 1, title: "помити кота" },
                { id: 2, title: "приготувати суп" },
                { id: 3, title: "сходити в магазин" }
            ]
        },
        {
            id: 2,
            title: "В процесі",
            cards: [
                { id: 4, title: "подивитися серіал" }
            ]
        },
        {
            id: 3,
            title: "Зроблено",
            cards: [
                { id: 5, title: "зробити домашку" },
                { id: 6, title: "погуляти з собакой" }
            ]
        }
    ]);

    return (
        <div className="board">
            <h1 className="title">{title} (ID: {board_id})</h1>

            <div className="lists-container">
                {lists.map((list) => (
                    <List
                        key={list.id}
                        id={list.id}
                        title={list.title}
                        cards={list.cards}
                    />
                ))}
            </div>
            <button className="add-list-btn">+ add new list</button>
            <button className="add-card-btn">+ add new card</button>
        </div>
    );
}

export default Board;