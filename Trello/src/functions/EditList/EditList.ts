import api from "../../api/request.ts";

export const editList = async (boardId: number, listId: number, newTitle: string) => {
    const response = await api.put(`/board/${boardId}/list/${listId}`, { title: newTitle });
    return response.data;
};