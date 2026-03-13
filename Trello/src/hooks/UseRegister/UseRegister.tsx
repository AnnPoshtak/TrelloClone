import toast from 'react-hot-toast';
import api from '../../api/request.ts';
import { useNavigate } from 'react-router-dom';

export const useRegister = () => {
    const navigate = useNavigate();

    const emailRegex = /^((([0-9A-Za-z]{1}[-0-9A-z\.]{1,}[0-9A-Za-z]{1})|([0-9А-Яа-я]{1}[-0-9А-я\.]{1,}[0-9А-Яа-я]{1}))@([-A-Za-z]{1,}\.){1,2}[-A-Za-z]{2,})$/u;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,}$/;



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
            await api.post('/user', {
                email: email,
                password: password
            });

            toast.success("Registration successful!");
            navigate('/login');

        } catch (err: any) {
            console.error(err);

            if (err.response) {
                const status = err.response.status;

                if (status === 400) {
                    toast.error("Invalid registration data");
                } else if (status === 409) {
                    toast.error("User with this email already exists");
                } else if (status === 422) {
                    toast.error("Validation failed");
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
    return { Register }
};