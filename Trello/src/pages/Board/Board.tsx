    import { useState } from "react";
    import "./Board.scss";
    import type { Card } from "../../common/interfaces/Card.tsx";
    import List from "./components/List/List.tsx";

    function Board() {
        const [title, setTitle] = useState<string>("Моя тестова дошка");

        interface IList {
            id: number;
            title: string;
            cards: Card[];
        }

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
                <h1 className="title">{title}</h1>

                <div className="lists-container">
                    {lists.map((list) => (
                        <List
                            key={list.id}
                            title={list.title}
                            cards={list.cards}
                        />
                    ))}
                </div>
            </div>
        );
    }

    export default Board;