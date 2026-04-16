import api from "../../api/request.ts";
import { deleteList, editList } from "../../services/list.ts";
import toast from "react-hot-toast";
import type { IList } from "../../common/interfaces/IList.ts";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useList(board_id: string | undefined, lists: IList[]) {
    const queryClient = useQueryClient();

    const createListMutation = useMutation({
        mutationFn: async (title: string) => {
            if (!board_id) throw new Error("Board ID is required");
            const response = await api.post(`/board/${board_id}/list`, {
                title, 
                position: lists.length + 1
            });
            return response.data;
        },
        onSuccess: () => {
            toast.success("List created successfully");
            queryClient.invalidateQueries({ queryKey: ["board", board_id] });
        },
        onError: () => {
            toast.error("Failed to create list");
        }
    });

    const handleCreateList = (title: string, onSuccessModal: () => void) => {
        createListMutation.mutate(title, {
            onSuccess: () => onSuccessModal()
        });
    };

    const deleteListMutation = useMutation({
        mutationFn: async (listId: number) => {
            if (!board_id) throw new Error("Board ID is required");
            await deleteList(board_id, listId);
        },
        onSuccess: () => {
            toast.success("List deleted successfully");
            queryClient.invalidateQueries({ queryKey: ["board", board_id] });
        },
        onError: () => {
            toast.error("Failed to delete list");
        }
    });

    const handleListDelete = (listId: number) => {
        if (!board_id) return;
        deleteListMutation.mutate(listId);
    };

    const editListMutation = useMutation({
        mutationFn: async ({ listId, title }: { listId: number; title: string }) => {
            if (!board_id) throw new Error("Board ID is required");
            await editList(board_id, listId, title);
        },
        onSuccess: () => {
            toast.success("List updated successfully");
            queryClient.invalidateQueries({ queryKey: ["board", board_id] });
        },
        onError: () => {
            toast.error("Failed to update list");
        }
    });

    const handleEditList = (listId: number, newTitle: string) => {
        if (!board_id) return;
        if (!newTitle || newTitle.trim() === "") return;
        editListMutation.mutate({ listId, title: newTitle });
    };

    return { handleCreateList, handleListDelete, handleEditList };
}