import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import type { IList } from "../../common/interfaces/IList.ts";
import type { IBoard } from "../../common/interfaces/IBoard.ts";
import List from "./components/List/List.tsx";
import api from "../../api/request.ts";

function Board() {
    // 1. ВАЖЛИВО: Ім'я тут МАЄ співпадати з :board_id в App.tsx
    const { board_id } = useParams();

    const [board, setBoard] = useState<IBoard | null>(null);

    // Мок-дані для списків (поки що)
    const [lists, setLists] = useState<IList[]>([
        {
            id: 1,
            title: "Плани",
            cards: [{ id: 1, title: "помити кота" }]
        }
    ]);

    useEffect(() => {
        async function fetchBoardData() {
            // 2. Перевіряємо саме board_id
            if (!board_id) return;

            try {
                // 3. Робимо запит з board_id
                const response = await api.get(`/board/${board_id}`);

                console.log("Прийшла дошка:", response); // Глянь в консоль!
                setBoard(response);

            } catch (error) {
                console.error("Помилка:", error);
                alert("Не знайшов таку дошку!");
            }
        }

        fetchBoardData();
    }, [board_id]); // 4. Слідкуємо за board_id

    // Лоадер
    if (!board) {
        return <div style={{ padding: "20px" }}>Завантаження... (ID: {board_id})</div>;
    }

    // Рендер
    return (
        <div
            className="board"
            style={{
                background: board.custom?.background || '#eee',
                minHeight: '100vh',
                padding: '20px'
            }}
        >
            <h1 className="title">{board.title}</h1>

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

            <div className="board-controls">
                <button className="add-list-btn">+ add new list</button>
            </div>
        </div>
    );
}

export default Board;