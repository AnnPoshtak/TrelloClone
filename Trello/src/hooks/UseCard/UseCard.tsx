import toast from "react-hot-toast";
import api from "../../api/request.ts";
import type { IList } from "../../common/interfaces/IList.ts";
import { deleteCard, editCard } from "../../services/card.ts";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCard(board_id: string | undefined, lists: IList[]) {
    const queryClient = useQueryClient();

    const createCardMutation = useMutation({
        mutationFn: async ({ title, listId }: { title: string; listId: number }) => {
            if (!board_id) throw new Error("Board ID is required");
            const response = await api.post(`/board/${board_id}/card`, {
                title,
                list_id: listId,
                position: lists.find(l => l.id === listId)?.cards.length || 0 + 1
            });
            return response.data;
        },
        onSuccess: () => {
            toast.success("Card created successfully");
            queryClient.invalidateQueries({ queryKey: ["board", board_id] });
        },
        onError: () => {
            toast.error("Failed to create card");
        }
    });

    const handleCreateCard = (title: string, listId: number, onSuccessModal: () => void) => {
        if (!board_id) return;
        createCardMutation.mutate({ title, listId }, {
            onSuccess: () => onSuccessModal()
        });
    };

    const deleteCardMutation = useMutation({
        mutationFn: async (cardId: number) => {
            if (!board_id) throw new Error("Board ID is required");
            await deleteCard(board_id, cardId);
        },
        onSuccess: () => {
            toast.success("Card deleted successfully");
            queryClient.invalidateQueries({ queryKey: ["board", board_id] });
        },
        onError: () => {
            toast.error("Failed to delete card");
        }
    });

    const handleCardDelete = (listId: number, cardId: number) => {
        if (!board_id) return;
        deleteCardMutation.mutate(cardId);
    };
    const editCardMutation = useMutation({
        mutationFn: async ({ cardId, payload }: { cardId: number; payload: any }) => {
            if (!board_id) throw new Error("Board ID is required");
            await editCard(board_id, cardId, payload);
        },
        onSuccess: () => {
            toast.success("Card updated successfully");
            queryClient.invalidateQueries({ queryKey: ["board", board_id] });
        },
        onError: () => {
            toast.error("Failed to update card");
        }
    });

    const handleEditCard = (listId: number, cardId: number) => {
        if (!board_id) return;
        const list = lists.find(l => l.id === listId);
        const card = list?.cards.find(c => c.id === cardId);

        if (!card) return;

        const newTitle = window.prompt("New card title:", card.title);
        if (!newTitle || newTitle.trim() === "" || newTitle === card.title) return;

        const payload = {
            title: newTitle,
            list_id: listId,
            position: card.position,
            description: card.description
        };

        editCardMutation.mutate({ cardId, payload });
    };

    
    const moveCardMutation = useMutation({
        mutationFn: async ({ cardId, listId, position }: { cardId: number; listId: number; position: number }) => {
            if (!board_id) throw new Error("Board ID is required");
            await api.put(`/board/${board_id}/card`, [{
                id: cardId,
                list_id: listId,
                position: position
            }]);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["board", board_id] });
        },
        onError: (err) => {
            console.error(err);
            toast.error("Failed to move card on server");
        }
    });

    const handleCardMove = (cardId: number, currentListId: number, newListId: number) => {
        if (currentListId === newListId) return;
        const targetList = lists.find((l) => l.id === newListId);
        if (!targetList) return;
        const newPosition = targetList.cards.length + 1;
        moveCardMutation.mutate({ cardId, listId: newListId, position: newPosition });
    };

    return { handleCardDelete, handleEditCard, handleCardMove, handleCreateCard };
}