import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useCard } from "./useCard";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import api from "@/api/request.ts";
import { deleteCard, editCard } from "@/services/card.ts";
import toast from "react-hot-toast";

vi.mock("@/api/request.ts", () => ({
    default: { post: vi.fn(), put: vi.fn() }
}));

vi.mock("@/services/card.ts", () => ({
    deleteCard: vi.fn(),
    editCard: vi.fn(),
}));

vi.mock("react-hot-toast", () => ({
    default: { success: vi.fn(), error: vi.fn() },
}));

const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    });
    return ({ children }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
};

describe("useCard Hook", () => {
    const mockBoardId = "123";
    const mockLists = [
        { id: 10, title: "Todo", cards: [{ id: 1, title: "Card 1", position: 1 }] },
        { id: 20, title: "Done", cards: [] }
    ];

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should create a card and call onSuccessModal", async () => {
        vi.mocked(api.post).mockResolvedValue({ data: { id: 99 } });
        const onSuccess = vi.fn();

        const { result } = renderHook(() => useCard(mockBoardId, mockLists), { wrapper: createWrapper() });

        result.current.handleCreateCard("New Task", 10, onSuccess);

        await waitFor(() => {
            expect(api.post).toHaveBeenCalledWith(`/board/${mockBoardId}/card`, {
                title: "New Task",
                list_id: 10,
                position: 1
            });
            expect(onSuccess).toHaveBeenCalled();
        });
    });

    it("should delete a card successfully", async () => {
        vi.mocked(deleteCard).mockResolvedValue({});

        const { result } = renderHook(() => useCard(mockBoardId, mockLists), { wrapper: createWrapper() });
        result.current.handleCardDelete(10, 1);

        await waitFor(() => {
            expect(deleteCard).toHaveBeenCalledWith(123, 1);
            expect(toast.success).toHaveBeenCalledWith("Card deleted successfully");
        });
    });

    it("should edit card with full payload", async () => {
        vi.mocked(editCard).mockResolvedValue({});
        const currentCard = { position: 1, description: "some desc" };

        const { result } = renderHook(() => useCard(mockBoardId, mockLists), { wrapper: createWrapper() });
        result.current.handleEditCard(10, 1, "Updated Title", currentCard);

        await waitFor(() => {
            expect(editCard).toHaveBeenCalledWith(123, 1, {
                title: "Updated Title",
                list_id: 10,
                position: 1,
                description: "some desc"
            });
        });
    });

    it("should move card to a new list", async () => {
        vi.mocked(api.put).mockResolvedValue({});

        const { result } = renderHook(() => useCard(mockBoardId, mockLists), { wrapper: createWrapper() });

        result.current.handleCardMove(1, 10, 20);

        await waitFor(() => {
            expect(api.put).toHaveBeenCalledWith(`/board/${mockBoardId}/card`, [{
                id: 1,
                list_id: 20,
                position: 1
            }]);
        });
    });

    it("should show error toast when move fails", async () => {
        vi.mocked(api.put).mockRejectedValue(new Error("Move failed"));
        console.error = vi.fn();

        const { result } = renderHook(() => useCard(mockBoardId, mockLists), { wrapper: createWrapper() });

        result.current.handleCardMove(1, 10, 20);

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith("Failed to move card on server");
        });
    });

    it("should not call editCard if title is empty", () => {
        const { result } = renderHook(() => useCard(mockBoardId, mockLists), { wrapper: createWrapper() });

        result.current.handleEditCard(10, 1, "", {});

        expect(editCard).not.toHaveBeenCalled();
    });

    it("should show error toast when create card fails", async () => {
        vi.mocked(api.post).mockRejectedValue(new Error("Server error"));
        const onSuccess = vi.fn();

        const { result } = renderHook(() => useCard(mockBoardId, mockLists), {
            wrapper: createWrapper(),
        });

        result.current.handleCreateCard("New Task", 10, onSuccess);

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith("Failed to create card");
            expect(onSuccess).not.toHaveBeenCalled();
        });
    });

    it("should not call api.post when board_id is undefined", () => {
        const onSuccess = vi.fn();

        const { result } = renderHook(() => useCard(undefined, mockLists), {
            wrapper: createWrapper(),
        });

        result.current.handleCreateCard("New Task", 10, onSuccess);

        expect(api.post).not.toHaveBeenCalled();
    });

    it("should use position 1 when list is not found", async () => {
        vi.mocked(api.post).mockResolvedValue({ data: { id: 101 } });

        const { result } = renderHook(() => useCard(mockBoardId, mockLists), {
            wrapper: createWrapper(),
        });

        result.current.handleCreateCard("Orphan Card", 999, vi.fn());

        await waitFor(() => {
            expect(api.post).toHaveBeenCalledWith(`/board/${mockBoardId}/card`, {
                title: "Orphan Card",
                list_id: 999,
                position: 1,
            });
        });
    });


    it("should not call deleteCard when board_id is undefined", () => {
        const { result } = renderHook(() => useCard(undefined, mockLists), {
            wrapper: createWrapper(),
        });

        result.current.handleCardDelete(10, 1);

        expect(deleteCard).not.toHaveBeenCalled();
    });

    it("should show success toast when edit card succeeds", async () => {
        vi.mocked(editCard).mockResolvedValue({});

        const { result } = renderHook(() => useCard(mockBoardId, mockLists), {
            wrapper: createWrapper(),
        });

        result.current.handleEditCard(10, 1, "Valid Title", {
            position: 1,
            description: "desc",
        });

        await waitFor(() => {
            expect(toast.success).toHaveBeenCalledWith("Card updated successfully");
        });
    });

    it("should show error toast when edit card fails", async () => {
        vi.mocked(editCard).mockRejectedValue(new Error("Edit failed"));

        const { result } = renderHook(() => useCard(mockBoardId, mockLists), {
            wrapper: createWrapper(),
        });

        result.current.handleEditCard(10, 1, "Valid Title", {
            position: 1,
            description: "desc",
        });

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith("Failed to update card");
        });
    });


    it("should not call editCard when board_id is undefined", () => {
        const { result } = renderHook(() => useCard(undefined, mockLists), {
            wrapper: createWrapper(),
        });

        result.current.handleEditCard(10, 1, "Some Title", { position: 1 });

        expect(editCard).not.toHaveBeenCalled();
    });


    it("should not call api.put when moving to the same list", () => {
        const { result } = renderHook(() => useCard(mockBoardId, mockLists), {
            wrapper: createWrapper(),
        });

        result.current.handleCardMove(1, 10, 10);

        expect(api.put).not.toHaveBeenCalled();
    });

    it("should not call api.put when target list does not exist", () => {
        const { result } = renderHook(() => useCard(mockBoardId, mockLists), {
            wrapper: createWrapper(),
        });

        result.current.handleCardMove(1, 10, 999);

        expect(api.put).not.toHaveBeenCalled();
    });

    it("should not call api.put when board_id is undefined", () => {
        const { result } = renderHook(() => useCard(undefined, mockLists), {
            wrapper: createWrapper(),
        });

        result.current.handleCardMove(1, 10, 20);

        expect(api.put).not.toHaveBeenCalled();
    });

    it("should show success toast after successful create", async () => {
        vi.mocked(api.post).mockResolvedValue({ data: { id: 99 } });

        const { result } = renderHook(() => useCard(mockBoardId, mockLists), {
            wrapper: createWrapper(),
        });

        result.current.handleCreateCard("Task", 10, vi.fn());

        await waitFor(() => {
            expect(toast.success).toHaveBeenCalledWith("Card created successfully");
        });
    });
});