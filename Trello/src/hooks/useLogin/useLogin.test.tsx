import { renderHook, act, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import toast from "react-hot-toast";
import { useLogin } from "./useLogin";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createElement } from "react";

const { mockNavigate } = vi.hoisted(() => ({ mockNavigate: vi.fn() }));
vi.mock("react-router-dom", () => ({
    useNavigate: () => mockNavigate,
}));

const { mockPost } = vi.hoisted(() => ({ mockPost: vi.fn() }));
vi.mock("@/api/request.ts", () => ({
    default: { post: mockPost },
}));

vi.mock("react-hot-toast", () => ({
    default: {
        success: vi.fn(),
        error: vi.fn(),
    },
}));

vi.mock("react-hot-toast", () => ({
    default: {
        success: vi.fn(),
        error: vi.fn(),
    },
}));

const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
        getItem: vi.fn((key: string) => store[key] ?? null),
        setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
        clear: vi.fn(() => { store = {}; }),
    };
})();


const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    });
    return ({ children }: { children: React.ReactNode }) =>
        createElement(QueryClientProvider, { client: queryClient }, children);
};

describe("useLogin", () => {
    beforeEach(() => {
        localStorageMock.clear();
        vi.clearAllMocks();
    });

    it("should show error toast when email is empty", () => {
        const { result } = renderHook(() => useLogin(), {
            wrapper: createWrapper(),
        });

        act(() => { result.current.login("", "password"); });

        expect(toast.error).toHaveBeenCalledWith("Please fill in all fields");
        expect(mockPost).not.toHaveBeenCalled();
    });

    it("should show error toast when password is empty", () => {
        const { result } = renderHook(() => useLogin(), {
            wrapper: createWrapper(),
        });

        act(() => { result.current.login("test@gmail.com", ""); });

        expect(toast.error).toHaveBeenCalledWith("Please fill in all fields");
        expect(mockPost).not.toHaveBeenCalled();
    });

    it("should call api.post with correct credentials", async () => {
        vi.mocked(mockPost).mockResolvedValueOnce({ token: "tok", refreshToken: "ref" });

        const { result } = renderHook(() => useLogin(), {
            wrapper: createWrapper(),
        });

        await act(async () => { result.current.login("test@gmail.com", "Password123!"); });

        expect(mockPost).toHaveBeenCalledWith('/login', { email: "test@gmail.com", password: "Password123!" });
    });

    it("should save tokens and navigate on successful login", async () => {
        vi.mocked(mockPost).mockResolvedValueOnce({ token: "tok", refreshToken: "ref" });

        const { result } = renderHook(() => useLogin(), {
            wrapper: createWrapper(),
        });

        await act(async () => { result.current.login("test@gmail.com", "Password123!"); });

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/');
        });

        expect(toast.success).toHaveBeenCalledWith("Login successful");
    });

    it("should show error toast when response has no token", async () => {
        vi.mocked(mockPost).mockResolvedValueOnce({});

        const { result } = renderHook(() => useLogin(), {
            wrapper: createWrapper(),
        });

        await act(async () => { result.current.login("test@gmail.com", "Password123!"); });

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith("Login error");
        });

        expect(mockNavigate).not.toHaveBeenCalled();
        expect(localStorageMock.setItem).not.toHaveBeenCalled();
    });

    it("should show error toast and log error when api throws", async () => {
        const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
        vi.mocked(mockPost).mockRejectedValueOnce(new Error("Network error"));

        const { result } = renderHook(() => useLogin(), {
            wrapper: createWrapper(),
        });

        await act(async () => { result.current.login("test@gmail.com", "Password123!"); });

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith("Login failed");
        });

        expect(consoleSpy).toHaveBeenCalled();
        consoleSpy.mockRestore();
    });
});