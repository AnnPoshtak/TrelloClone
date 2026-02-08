import api from "../../api/request.ts";

export const editBoard = async (boardId: number, newTitle: string) => {
    const response = await api.put(`/board/${boardId}`, { title: newTitle });
    return response.data;
};