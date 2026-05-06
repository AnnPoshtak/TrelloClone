import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useList } from "./useList";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import api from "@/api/request.ts";
import { deleteList, editList } from "@/services/list.ts";
import toast from "react-hot-toast";

vi.mock("@/api/request.ts", () => ({
  default: { post: vi.fn() }
}));

vi.mock("@/services/list.ts", () => ({
  deleteList: vi.fn(),
  editList: vi.fn(),
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

describe("useList Hook", () => {
  const mockBoardId = "123";
  const mockLists = [{ id: 1, title: "List 1", position: 1 }];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should create a list and call onSuccessModal", async () => {
    vi.mocked(api.post).mockResolvedValue({ data: { id: 2, title: "New List" } });
    const onSuccessModal = vi.fn();

    const { result } = renderHook(() => useList(mockBoardId, mockLists), { 
      wrapper: createWrapper() 
    });

    result.current.handleCreateList("New List", onSuccessModal);

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith(`/board/${mockBoardId}/list`, {
        title: "New List",
        position: 2 
      });
      expect(toast.success).toHaveBeenCalledWith("List created successfully");
      expect(onSuccessModal).toHaveBeenCalled(); 
    });
  });

  it("should delete a list successfully", async () => {
    vi.mocked(deleteList).mockResolvedValue({});

    const { result } = renderHook(() => useList(mockBoardId, mockLists), { 
      wrapper: createWrapper() 
    });

    result.current.handleListDelete(1);

    await waitFor(() => {
      expect(deleteList).toHaveBeenCalledWith(123, 1);
      expect(toast.success).toHaveBeenCalledWith("List deleted successfully");
    });
  });

  it("should update list title successfully", async () => {
    vi.mocked(editList).mockResolvedValue({});

    const { result } = renderHook(() => useList(mockBoardId, mockLists), { 
      wrapper: createWrapper() 
    });

    result.current.handleEditList(1, "Updated Title");

    await waitFor(() => {
      expect(editList).toHaveBeenCalledWith(123, 1, "Updated Title");
      expect(toast.success).toHaveBeenCalledWith("List updated successfully");
    });
  });

  it("should not call editList mutation if title is empty", () => {
    const { result } = renderHook(() => useList(mockBoardId, mockLists), { 
      wrapper: createWrapper() 
    });

    result.current.handleEditList(1, "   ");

    expect(editList).not.toHaveBeenCalled();
  });

  it("should show error toast when creation fails", async () => {
    vi.mocked(api.post).mockRejectedValue(new Error("Fail"));
    
    const { result } = renderHook(() => useList(mockBoardId, mockLists), { 
      wrapper: createWrapper() 
    });

    result.current.handleCreateList("Fail List", () => {});

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Failed to create list");
    });
  });

  it("should throw error if board_id is missing during mutation", async () => {
    const { result } = renderHook(() => useList(undefined, mockLists), { 
      wrapper: createWrapper() 
    });

    result.current.handleListDelete(1);

    expect(deleteList).not.toHaveBeenCalled();
  });
});