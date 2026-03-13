import toast from "react-hot-toast";
import api from "../../api/request.ts";
import type { IList } from "../../common/interfaces/IList.ts";
import { deleteCard } from "../../functions/DeleteCard/DeleteCard.ts";
import { editCard } from "../../functions/EditCard/EditCard.ts";

export function useCard(
    board_id: string | undefined,
    lists: IList[],
    setLists: React.Dispatch<React.SetStateAction<IList[]>>
) {
    
    async function handleCreateCard(title: string, listId: number, onSuccess: () => void) {
        if (!board_id) return;
        const targetList = lists.find(list => list.id === listId);
        if (!targetList) return;

        const newPosition = targetList.cards.length + 1;

        const load = {
            title: title,
            list_id: listId,
            position: newPosition,
            description: "",
        };

        try {
            const response = await api.post(`/board/${board_id}/card`, load);
            const serverData = response.data || response;
            const newCard = {
                ...load,
                ...serverData,
            };
            
            setLists(prevLists => prevLists.map(list => {
                if (list.id === listId) {
                    return {
                        ...list,
                        cards: [...list.cards, newCard]
                    };
                }
                return list;
            }));
            
            toast.success("Card created successfully");
            onSuccess();
            
        } catch (err: any) {
            console.error(err);
            if (err.response) {
                const status = err.response.status;
                if (status === 400) {
                    toast.error("Invalid card data");
                } else {
                    toast.error("Failed to create card");
                }
            } else if (err.request) {
                toast.error("Network error. Please check your connection");
            } else {
                toast.error("An error occurred: " + err.message);
            }
        }
    }

    const handleCardDelete = async (listId: number, cardId: number) => {
        if (!board_id) return;

        try {
            await deleteCard(board_id, cardId);
            setLists(prevLists => prevLists.map(l => {
                if (l.id === listId) {
                    return {
                        ...l,
                        cards: l.cards.filter(c => c.id !== cardId)
                    };
                }
                return l;
            }));
            toast.success("Card deleted");
        } catch (err: any) {
            console.error(err);
            if (err.response) {
                const status = err.response.status;
                if (status === 404) {
                    toast.error("Card not found");
                } else {
                    toast.error("Failed to delete card");
                }
            } else if (err.request) {
                toast.error("Network error");
            } else {
                toast.error("An error occurred: " + err.message);
            }
        }
    };

    const handleEditCard = async (listId: number, cardId: number) => {
        if (!board_id) return;
        const list = lists.find(l => l.id === listId);
        const card = list?.cards.find(c => c.id === cardId);

        if (!card) return;

        const newTitle = window.prompt("New title:", card.title);

        if (!newTitle || newTitle.trim() === "" || newTitle === card.title) return;

        const load = {
            title: newTitle,
            list_id: listId,
            position: card.position,
            description: card.description
        };

        try {
            await editCard(board_id, cardId, load);

            setLists(prevLists => prevLists.map(currentList => {
                if (currentList.id === listId) {
                    return {
                        ...currentList,
                        cards: currentList.cards.map(c => {
                            if (c.id === cardId) {
                                return { ...c, title: newTitle };
                            }
                            return c;
                        })
                    };
                }
                return currentList;
            }));
            toast.success("Card updated");
        } catch (err: any) {
            console.error(err);
            if (err.response) {
                const status = err.response.status;
                if (status === 400) {
                    toast.error("Invalid card data");
                } else {
                    toast.error("Failed to update card");
                }
            } else if (err.request) {
                toast.error("Network error");
            } else {
                toast.error("An error occurred: " + err.message);
            }
        }
    };

    const handleCardMove = async (cardId: number, currentListId: number, newListId: number) => {
        if (currentListId === newListId) return;

        const currentList = lists.find((l) => l.id === currentListId);
        const cardToMove = currentList?.cards.find((c) => c.id === cardId);
        const targetList = lists.find((l) => l.id === newListId);

        if (!cardToMove || !board_id || !targetList) return;

        const newPosition = targetList.cards.length + 1;

        setLists((prevLists) => {
            return prevLists.map(list => {
                if (list.id === currentListId) {
                    return {...list, cards: list.cards.filter(c => c.id !== cardId)};
                }
                if (list.id === newListId) {
                    return {...list, cards: [...list.cards, { ...cardToMove, position: newPosition }]};
                }
                return list;
            });
        });

        const load = [{
            id: cardId,
            position: newPosition,
            list_id: newListId
        }];

        try {
            await api.put(`/board/${board_id}/card`, load);
        } catch (err: any) {
            console.error(err);
            if (err.response) {
                const status = err.response.status;
                if (status === 400) {
                    toast.error("Failed to move card: Invalid data");
                } else {
                    toast.error("Failed to move card on server");
                }
            } else if (err.request) {
                toast.error("Network error");
            } else {
                toast.error("An error occurred: " + err.message);
            }
        }
    };

    return { handleCardDelete, handleEditCard, handleCardMove, handleCreateCard };
}