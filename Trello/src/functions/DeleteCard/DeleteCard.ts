import api from "../../api/request.ts";

export const deleteCard = async (boardId: number, cardId: number) => {
    const response = await api.delete(`/board/${boardId}/card/${cardId}`);
    return response.data
};