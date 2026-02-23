import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/request.ts";
import toast from "react-hot-toast";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email.trim() || !password.trim()) {
            toast.error("Please fill in all fields");
            return;
        }

        try {
            const response = await api.post('/login', {
                email: email,
                password: password
            });
            const token = response.token;
            console.log(token);
            console.log(response);

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

    return (
        <div className="auth-container">
            <h1>Login</h1>
            <form onSubmit={handleLogin} className="auth-form">
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Sign in</button>
            </form>
            <p>Don't have an account? <Link to="/register">Register</Link></p>
        </div>
    );
}

export default Login;