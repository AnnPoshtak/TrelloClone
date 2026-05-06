import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "@/api/request.ts"; 
import type { IBoard } from "@/common/interfaces/IBoard.ts";

export function useBoards() {
    const navigate = useNavigate();
    const [boards, setBoards] = useState<IBoard[]>([]);

    useEffect(() => {
        async function fetchBoards() {
            try {
                const response = await api.get('/board');
                setBoards(response.boards);
            } catch (err: any) {
                if (err.response?.status === 401) {
                    navigate("/login");
                } else {
                    toast.error("Error loading boards");
                }
            }
        }
        fetchBoards();
    }, [navigate]);

    async function createBoard(title: string, color: string) {
        try {
            const response = await api.post('/board', {
                title: title,
                custom: { background: color }
            });

            const newBoard: IBoard = {
                id: response.id,
                title: title,
                custom: { background: color } as any
            };

            setBoards(prevBoards => [...prevBoards, newBoard]);
            toast.success("Created");
            return true; 
        } catch (err: any) {
            toast.error("Error");
            return false; 
        }
    }

    return { boards, createBoard };
}