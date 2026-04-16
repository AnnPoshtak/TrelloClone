import { useNavigate } from "react-router-dom";
import api from "../../api/request.ts";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";

export function useLogin() {
    const navigate = useNavigate();

    const loginMutation = useMutation({
        mutationFn: async ({ email, password }: { email: string; password: string }) => {
            const response = await api.post('/login', { email, password });
            return response;
        },
        onSuccess: (data) => {
            const token = data.data.token;
            const refreshToken = data.data.refreshToken;

            if (token) {
                localStorage.setItem('token', token);
                localStorage.setItem('refreshToken', refreshToken);
                toast.success("Login successful");
                navigate('/');
            } else {
                toast.error("Login error")
            }
        },
        onError: (error) => {
            console.error("Помилка логіну:", error);
            toast.error("Login failed");
        }
    });
    const login = (email: string, password: string) => {
        if (!email.trim() || !password.trim()) {
            toast.error("Please fill in all fields");
            return;
        }

        loginMutation.mutate({ email, password });
    };

    return { login };
}