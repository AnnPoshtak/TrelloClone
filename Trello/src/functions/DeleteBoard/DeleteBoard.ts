import api from "../../api/request.ts";

export const deleteBoard = async (boardId: number) => {
    const response = await api.delete(`/board/${boardId}`);
    return response.data
};