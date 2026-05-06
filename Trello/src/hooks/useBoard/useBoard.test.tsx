import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useBoard } from "./useBoard"; 
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import api from "@/api/request.ts";
import { deleteBoard, editBoard } from "@/services/board.ts";
import toast from "react-hot-toast";

vi.mock("@/api/request.ts", () => ({
  default: { get: vi.fn() }
}));

vi.mock("@/services/board.ts", () => ({
  deleteBoard: vi.fn(),
  editBoard: vi.fn(),
}));

const mockNavigate = vi.fn();
vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock("react-hot-toast", () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useBoard Hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch and return board data", async () => {
    const mockBoard = { id: "1", title: "Project Alpha", lists: [1, 2, 3] };
    vi.mocked(api.get).mockResolvedValue(mockBoard);

    const { result } = renderHook(() => useBoard("1"), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.board).toEqual(mockBoard);
    expect(result.current.lists).toHaveLength(3);
  });

  it("should show error toast if fetching fails", async () => {
    vi.mocked(api.get).mockRejectedValue(new Error("Network Error"));

    renderHook(() => useBoard("1"), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Failed to load board data");
    });
  });

  it("should successfully delete a board and navigate home", async () => {
    vi.mocked(api.get).mockResolvedValue({ id: "1", title: "To Delete" });
    vi.mocked(deleteBoard).mockResolvedValue({});

    const { result } = renderHook(() => useBoard("1"), { wrapper: createWrapper() });
    
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    result.current.handleBoardDelete();

    await waitFor(() => {
      expect(deleteBoard).toHaveBeenCalledWith(1);
      expect(toast.success).toHaveBeenCalledWith("Board deleted");
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  it("should not update if the new title is the same as the old one", async () => {
    vi.mocked(api.get).mockResolvedValue({ id: "1", title: "Same Title" });

    const { result } = renderHook(() => useBoard("1"), { wrapper: createWrapper() });
    
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await result.current.handleEditBoard("Same Title");

    expect(editBoard).not.toHaveBeenCalled();
  });

  it("should update board title successfully", async () => {
    vi.mocked(api.get).mockResolvedValue({ id: "1", title: "Old Title" });
    vi.mocked(editBoard).mockResolvedValue({});

    const { result } = renderHook(() => useBoard("1"), { wrapper: createWrapper() });
    
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    result.current.handleEditBoard("New Title");

    await waitFor(() => {
      expect(editBoard).toHaveBeenCalledWith(1, "New Title");
      expect(toast.success).toHaveBeenCalledWith("Board updated");
    });
  });

  it("should handle edit error and show toast", async () => {
    vi.mocked(api.get).mockResolvedValue({ id: "1", title: "Old Title" });
    vi.mocked(editBoard).mockRejectedValue(new Error("Update failed"));

    const { result } = renderHook(() => useBoard("1"), { wrapper: createWrapper() });
    
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    result.current.handleEditBoard("Failed Update");

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Failed to update board");
    });
  });

  it("should return empty lists when board data is not yet loaded", () => {
    vi.mocked(api.get).mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() => useBoard("1"), { wrapper: createWrapper() });

    expect(result.current.lists).toEqual([]);
    expect(result.current.isLoading).toBe(true);
  });
});