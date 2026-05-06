// useBoards.test.ts
import { renderHook, waitFor, act } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { useBoards } from "./useBoards";
import api from "@/api/request";
import toast from "react-hot-toast";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock("@/api/request", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

vi.mock("react-hot-toast", () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const mockBoards = [
  { id: "1", title: "Board One", custom: { background: "#ff0000" } },
  { id: "2", title: "Board Two", custom: { background: "#00ff00" } },
];

describe("useBoards", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should load boards list on mount", async () => {
    vi.mocked(api.get).mockResolvedValue({ boards: mockBoards });

    const { result } = renderHook(() => useBoards());

    await waitFor(() => expect(result.current.boards).toHaveLength(2));
    expect(result.current.boards).toEqual(mockBoards);
  });

  it("should redirect to /login when fetchBoards returns 401", async () => {
    vi.mocked(api.get).mockRejectedValue({
      response: { status: 401 },
    });

    renderHook(() => useBoards());

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/login"));
  });

  it("should show toast.error when fetchBoards fails with a non-401 error", async () => {
    vi.mocked(api.get).mockRejectedValue({ response: { status: 500 } });

    renderHook(() => useBoards());

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("Error loading boards")
    );
  });

  it("should append new board to the list after successful createBoard", async () => {
    vi.mocked(api.get).mockResolvedValue({ boards: mockBoards });
    vi.mocked(api.post).mockResolvedValue({ id: "3" });

    const { result } = renderHook(() => useBoards());
    await waitFor(() => expect(result.current.boards).toHaveLength(2));

    await act(async () => {
      await result.current.createBoard("New Board", "#0000ff");
    });

    expect(result.current.boards).toHaveLength(3);
    expect(result.current.boards[2]).toEqual({
      id: "3",
      title: "New Board",
      custom: { background: "#0000ff" },
    });
  });

  it("should show toast.success after successful createBoard", async () => {
    vi.mocked(api.get).mockResolvedValue({ boards: [] });
    vi.mocked(api.post).mockResolvedValue({ id: "3" });

    const { result } = renderHook(() => useBoards());

    await act(async () => {
      await result.current.createBoard("New Board", "#0000ff");
    });

    expect(toast.success).toHaveBeenCalledWith("Created");
  });

  it("should return true when createBoard succeeds", async () => {
    vi.mocked(api.get).mockResolvedValue({ boards: [] });
    vi.mocked(api.post).mockResolvedValue({ id: "3" });

    const { result } = renderHook(() => useBoards());

    let returnValue: boolean | undefined;
    await act(async () => {
      returnValue = await result.current.createBoard("New Board", "#0000ff");
    });

    expect(returnValue).toBe(true);
  });

  it("should show toast.error when createBoard fails", async () => {
    vi.mocked(api.get).mockResolvedValue({ boards: [] });
    vi.mocked(api.post).mockRejectedValue(new Error("Network error"));

    const { result } = renderHook(() => useBoards());

    await act(async () => {
      await result.current.createBoard("New Board", "#0000ff");
    });

    expect(toast.error).toHaveBeenCalledWith("Error");
  });

  it("should return false when createBoard fails", async () => {
    vi.mocked(api.get).mockResolvedValue({ boards: [] });
    vi.mocked(api.post).mockRejectedValue(new Error("Network error"));

    const { result } = renderHook(() => useBoards());

    let returnValue: boolean | undefined;
    await act(async () => {
      returnValue = await result.current.createBoard("New Board", "#0000ff");
    });

    expect(returnValue).toBe(false);
  });

  it("should not modify boards list when createBoard fails", async () => {
    vi.mocked(api.get).mockResolvedValue({ boards: mockBoards });
    vi.mocked(api.post).mockRejectedValue(new Error("Network error"));

    const { result } = renderHook(() => useBoards());
    await waitFor(() => expect(result.current.boards).toHaveLength(2));

    await act(async () => {
      await result.current.createBoard("New Board", "#0000ff");
    });

    expect(result.current.boards).toHaveLength(2);
  });
});