import api from "../api/request.ts";

const deleteList = async (boardId: number, listId: number) => {
    const response = await api.delete(`/board/${boardId}/list/${listId}`);
    return response.data
};

const editList = async (boardId: number, listId: number, newTitle: string) => {
    const response = await api.put(`/board/${boardId}/list/${listId}`, { title: newTitle });
    return response.data;
};

export { deleteList, editList };