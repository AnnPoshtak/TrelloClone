import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/request.ts";
import { deleteBoard } from "../../functions/DeleteBoard/DeleteBoard.ts";
import { editBoard } from "../../functions/EditBoard/EditBoard.ts";
import toast from "react-hot-toast";
import type { IBoard } from "../../common/interfaces/IBoard.ts";
import type { IList } from "../../common/interfaces/IList.ts";

export function UseBoard(board_id: string | undefined) {
    const navigate = useNavigate();
    const [board, setBoard] = useState<IBoard | null>(null);
    const [lists, setLists] = useState<IList[]>([]);

    useEffect(() => {
        async function fetchBoardData() {
            if (!board_id) return;
            try {
                const response = await api.get(`/board/${board_id}`);
                setBoard(response);
                if (response.lists) setLists(response.lists);
            } catch (err: any) {
                console.error(err);
                toast.error("Failed to load board data");
            }
        }
        fetchBoardData();
    }, [board_id]);

    const handleBoardDelete = async () => {
        if (!board_id) return;
        try {
            await deleteBoard(board_id);
            toast.success("Board deleted");
            navigate('/');
        } catch (err) {
            toast.error("Failed to delete board");
        }
    };

    const handleEditBoard = async () => {
        if (!board_id || !board) return;
        const newTitle = window.prompt("Enter new board title:", board.title);
        if (!newTitle || newTitle.trim() === "" || newTitle === board.title) return;

        try {
            await editBoard(board_id, newTitle);
            setBoard({ ...board, title: newTitle });
            toast.success("Board updated");
        } catch (err) {
            toast.error("Failed to update board");
        }
    };

    return { board, lists, setLists, handleBoardDelete, handleEditBoard };
}