import api from "..//api/request.ts";

const deleteCard = async (boardId: number, cardId: number) => {
    const response = await api.delete(`/board/${boardId}/card/${cardId}`);
    return response.data
};
const editCard = async (boardId: number, cardId: number, data: { title: string, list_id: number, position: number, description?: string }) => {
    const response = await api.put(`/board/${boardId}/card/${cardId}`, data);
    return response.data;
};

export { deleteCard, editCard };