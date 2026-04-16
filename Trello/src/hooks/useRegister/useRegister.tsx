import toast from 'react-hot-toast';
import api from '../../api/request.ts';
import { useNavigate } from 'react-router-dom';

export const useRegister = () => {
    const navigate = useNavigate();

    const emailRegex = /^((([0-9A-Za-z]{1}[-0-9A-z\.]{1,}[0-9A-Za-z]{1})|([0-9А-Яа-я]{1}[-0-9А-я\.]{1,}[0-9А-Яа-я]{1}))@([-A-Za-z]{1,}\.){1,2}[-A-Za-z]{2,})$/u;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,}$/;

    const registerMutation = async (email: string, password: string) => {
        try {
            const response = await api.post('/user', { email, password });
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    const Register = async (email: string, password: string, repeatPassword: string) => {

        if (!emailRegex.test(email)) {
            toast.error("Please enter a valid email address");
            return;
        }

        if (!passwordRegex.test(password)) {
            toast.error("The password must contain at least 8 characters, an uppercase letter, a lowercase letter, and a number");
            return;
        }

        if (!repeatPassword || password !== repeatPassword) {
            toast.error("Passwords do not match");
            return;
        }

        try {
            await registerMutation(email, password);
            toast.success("Registration successful!");
            navigate('/login');
        } catch (error) {
            console.error(error);
            toast.error("Registration failed");
        }
    };
    return { Register }
};