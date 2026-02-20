import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../api/request.ts";

function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    //const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const emailRegex = /^((([0-9A-Za-z]{1}[-0-9A-z\.]{1,}[0-9A-Za-z]{1})|([0-9А-Яа-я]{1}[-0-9А-я\.]{1,}[0-9А-Яа-я]{1}))@([-A-Za-z]{1,}\.){1,2}[-A-Za-z]{2,})$/u;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,}$/;

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        //setError(null);

        if (!emailRegex.test(email)) {
            //setError("Please enter a valid email address (e.g. user@example.com).");
            toast.error("Please enter a valid email address");
            return;
        }

        if (!passwordRegex.test(password)) {
            //setError("The password must contain at least 8 characters, an uppercase letter, a lowercase letter, and a number.");
            toast.error("The password must contain at least 8 characters, an uppercase letter, a lowercase letter, and a number.");
            return;
        }

        if (!repeatPassword || password != repeatPassword) {
            //setError("Passwords do not match");
            toast.error("Password do not match");
            return;
        }

        await api.post('/user', {
            email: email,
            password: password
        });
        navigate('/login');
    };

    return (
        <div className="auth-container">
            <h1>Registration</h1>
            <form onSubmit={handleRegister} className="auth-form">
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value);
                    }}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => {
                        setPassword(e.target.value);
                    }}
                />
                <input
                    type="password"
                    placeholder="Repeat Password"
                    value={repeatPassword}
                    onChange={(e) => {
                        setRepeatPassword(e.target.value);
                    }}
                />

                <button type="submit">Sign up</button>
            </form>
            <p>Already have an account?? <Link to="/login">Sign in</Link></p>
        </div>
    );
}

export default Register;