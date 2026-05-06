import { renderHook, act } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import toast from "react-hot-toast";
import { useRegister } from "./useRegister";

const { mockNavigate } = vi.hoisted(() => ({ mockNavigate: vi.fn() }));
vi.mock("react-router-dom", () => ({
    useNavigate: () => mockNavigate,
}));

const { mockPost } = vi.hoisted(() => ({ mockPost: vi.fn() }));
vi.mock("@/api/request.ts", () => ({
    default: { post: mockPost },
}));

vi.mock("react-hot-toast", () => ({
    default: { success: vi.fn(), error: vi.fn() },
}));

const email = "test@gmail.com";
const password = "Password123!";

describe("useRegister", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should show error toast when email is invalid", async () => {
        const { result } = renderHook(() => useRegister())
        act(() => { result.current.Register("be-be-be", password, password) })
        expect(toast.error).toHaveBeenCalledWith("Please enter a valid email address")
        expect(mockPost).not.toHaveBeenCalled();
    });

    it("should show error toast when password is too weak", async () => {
        const { result } = renderHook(() => useRegister())
        act(() => { result.current.Register(email, "123", "123") })
        expect(toast.error).toHaveBeenCalledWith("The password must contain at least 8 characters, an uppercase letter, a lowercase letter, and a number")
        expect(mockPost).not.toHaveBeenCalled();
    });

    it("should show error toast when passwords do not match", async () => {
        const { result } = renderHook(() => useRegister())
        act(() => { result.current.Register(email, password, "123") })
        expect(toast.error).toHaveBeenCalledWith("Passwords do not match")
        expect(mockPost).not.toHaveBeenCalled();
    });

    it("should show error toast when repeatPassword is empty", async () => {
        const { result } = renderHook(() => useRegister())
        act(() => { result.current.Register(email, password, "") })
        expect(toast.error).toHaveBeenCalledWith("Passwords do not match")
        expect(mockPost).not.toHaveBeenCalled();
    });

    it("should call api.post with correct data on valid input", async () => {
        vi.mocked(mockPost).mockResolvedValueOnce({ data: {} })
        const { result } = renderHook(() => useRegister())
        act(() => { result.current.Register(email, password, password) })
        expect(mockPost).toHaveBeenCalledWith("/user", { email: email, password: password })
    });
    it("should call api.post with correct data on valid input", async () => {
        vi.mocked(mockPost).mockResolvedValueOnce({ data: {} });
        const { result } = renderHook(() => useRegister());
        await act(async () => { result.current.Register(email, password, password); });
        expect(mockPost).toHaveBeenCalledWith("/user", { email, password });
    });

    it("should show success toast and navigate to /login on success", async () => {
        vi.mocked(mockPost).mockResolvedValueOnce({ data: {} });
        const { result } = renderHook(() => useRegister());
        await act(async () => { result.current.Register(email, password, password); });
        expect(toast.success).toHaveBeenCalledWith("Registration successful!");
        expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
});