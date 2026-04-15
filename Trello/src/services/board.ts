import api from "../api/request.ts";

const deleteBoard = async (boardId: number) => {
    const response = await api.delete(`/board/${boardId}`);
    return response.data
};

const editBoard = async (boardId: number, newTitle: string) => {
    const response = await api.put(`/board/${boardId}`, { title: newTitle });
    return response.data;
};

export { deleteBoard, editBoard };