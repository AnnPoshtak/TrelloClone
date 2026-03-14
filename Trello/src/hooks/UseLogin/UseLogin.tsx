import { useNavigate } from "react-router-dom";
import api from "../../api/request.ts";
import toast from "react-hot-toast";

export function UseLogin() {
    const navigate = useNavigate();

    const login = async (email: string, password: string) => {
        if (!email.trim() || !password.trim()) {
            toast.error("Please fill in all fields");
            return;
        }

        try {
            const response = await api.post('/login', { email, password });
            const token = response.token;

            if (token) {
                localStorage.setItem('token', token);
                toast.success("Login successful");
                navigate('/');
            } else {
                toast.error("Authentication failed");
            }

        } catch (err: any) {
            console.error(err);
            if (err.response) {
                const status = err.response.status;
                if (status === 400) {
                    toast.error("Invalid request");
                } else if (status === 401) {
                    toast.error("Invalid email or password");
                } else if (status === 404) {
                    toast.error("User not found");
                } else {
                    toast.error("Server error. Please try again later");
                }
            } else if (err.request) {
                toast.error("Network error. Please check your connection");
            } else {
                toast.error("An error occurred: " + err.message);
            }
        }
    };

    return { login };
}