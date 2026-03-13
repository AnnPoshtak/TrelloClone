import api from "../../api/request.ts";
import { deleteList } from "../../functions/DeleteList/DeleteList.ts";
import { editList } from "../../functions/EditList/EditList.ts";
import toast from "react-hot-toast";
import type { IList } from "../../common/interfaces/IList.ts";

export function useList(
    board_id: string | undefined, 
    lists: IList[], 
    setLists: React.Dispatch<React.SetStateAction<IList[]>>
) {
    const handleCreateList = async (title: string, onSuccess: () => void) => {
        if (!board_id) return;
        try {
            const response = await api.post(`/board/${board_id}/list`, {
                title, position: lists.length + 1
            });
            const data = response.data || response;
            setLists([...lists, { id: data.id, title, cards: [] }]);
            toast.success("List created successfully");
            onSuccess();
        } catch (err) {
            toast.error("Failed to create list");
        }
    };

    const handleListDelete = async (listId: number) => {
        if (!board_id) return;
        try {
            await deleteList(board_id, listId);
            setLists(prev => prev.filter(list => list.id !== listId));
            toast.success("List deleted");
        } catch (err) {
            toast.error("Failed to delete list");
        }
    };

    const handleEditList = async (listId: number) => {
        if (!board_id) return;
        const currentList = lists.find(l => l.id === listId);
        const newTitle = window.prompt("Enter new list title:", currentList?.title);
        if (!newTitle || newTitle === currentList?.title) return;

        try {
            await editList(board_id, listId, newTitle);
            setLists(prev => prev.map(list => list.id === listId ? { ...list, title: newTitle } : list));
            toast.success("List updated");
        } catch (err) {
            toast.error("Failed to update list");
        }
    };

    return { handleCreateList, handleListDelete, handleEditList };
}