import api from "../../api/request.ts";

export const deleteList = async (boardId: number, listId: number) => {
    const response = await api.delete(`/board/${boardId}/list/${listId}`);
    return response.data
};