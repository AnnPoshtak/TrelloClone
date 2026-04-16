import { useNavigate } from "react-router-dom";
import api from "../../api/request.ts";
import { deleteBoard, editBoard } from "../../services/board.ts";
import toast from "react-hot-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { IBoard } from "../../common/interfaces/IBoard.ts";

export function useBoard(board_id: string | undefined) {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: board, isLoading, isError } = useQuery<IBoard>({
        queryKey: ["board", board_id],
        queryFn: async () => {
            try {
                const response = await api.get(`/board/${board_id}`);
                return response; 
            } catch (err: any) {
                console.error(err);
                toast.error("Failed to load board data");
                throw err;
            }
        },
        enabled: !!board_id,
    });

    const lists = board?.lists || [];

    const deleteMutation = useMutation({
        mutationFn: async (boardId: string) => {
            await deleteBoard(Number(boardId)); 
        },
        onSuccess: () => {
            toast.success("Board deleted");
            navigate('/');
        },
        onError: () => {
            toast.error("Failed to delete board");
        }
    });

    const handleBoardDelete = () => {
        if (!board_id) return;
        deleteMutation.mutate(board_id);
    }; 

    const editMutation = useMutation({
        mutationFn: async ({ boardId, newTitle }: { boardId: string, newTitle: string }) => {
            await editBoard(Number(boardId), newTitle);
        },
        onSuccess: () => {
            toast.success("Board updated");
            queryClient.invalidateQueries({ queryKey: ["board", board_id] });
        },
        onError: () => {
            toast.error("Failed to update board");
        }
    });

    const handleEditBoard = async (newTitle: string) => {
        if (!board_id || !board) return;
        if (!newTitle || newTitle.trim() === "" || newTitle === board.title) return;
        editMutation.mutate({ boardId: board_id, newTitle });
    };

    return { board, lists, isLoading, isError, handleBoardDelete, handleEditBoard };
}