import { useNavigate } from "react-router-dom";
import api from "../../api/request.ts";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";

export function UseLogin() {
    const navigate = useNavigate();

    const loginMutation = useMutation({
        mutationFn: async ({ email, password }: { email: string; password: string }) => {
            const response = await api.post('/login', { email, password });
            return response.data;
        },
        onSuccess: (data) => {
            localStorage.setItem('token', data.token);
            toast.success("Login successful");
            navigate('/');
        },
        onError: () => {
            toast.error("Login failed");
        }
    });

    const login = async (email: string, password: string) => {
        if (!email.trim() || !password.trim()) {
            toast.error("Please fill in all fields");
            return;
        }

        try {
            loginMutation.mutate({ email, password });
        } catch (error) {
            console.error(error);
        }
    };

    return { login };
}