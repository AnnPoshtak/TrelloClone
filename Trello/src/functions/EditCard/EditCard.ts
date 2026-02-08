import api from "../../api/request.ts";

export const editCard = async (boardId: number, cardId: number, data: { title: string, list_id: number, position: number, description?: string }) => {
    const response = await api.put(`/board/${boardId}/card/${cardId}`, data);
    return response.data;
};