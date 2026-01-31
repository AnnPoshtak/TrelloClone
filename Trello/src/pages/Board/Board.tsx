import { useState } from "react";
import type { IList } from "../../common/interfaces/IList.ts"
import List from "./components/List/List.tsx";



function Board() {
    const [title, setTitle] = useState<string>("Моя тестова дошка");

    const [lists, setLists] = useState<IList[]>([
        {
            id: 1,
            title: "Плани",
            cards: [
                { id: 1, title: "помити кота" },
                { id: 2, title: "приготувати суп" },
                { id: 3, title: "сходити в магазин" },
                { id: 4, title: "<UNK> <UNK> <UNK>" },
                { id: 5, title: "<UNK> <UNK> <UNK>" },
                { id: 6, title: "<UNK> <UNK> <UNK>" },
                { id: 7, title: "<UNK> <UNK> <UNK>" },
                { id: 8, title: "<UNK> <UNK> <UNK>" },
                { id: 9, title: "<UNK> <UNK> <UNK>" },
                { id: 10, title: "<UNK> <UNK> <UNK>" },
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
            <h1 className="title">{title}</h1>

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