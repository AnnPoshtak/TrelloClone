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

        try {
            const response = await api.post('/login', {
                email: email,
                password: password
            });
            const token = response.data.token;

            if (token) {
                localStorage.setItem('token', token);
                navigate('/');
            } else {
                toast.error("Login failed");
            }

        } catch (err) {
            console.error(err);
            toast.error("Email or password incorrect");
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
            <p>Немає акаунту? <Link to="/register">Зареєструватися</Link></p>
        </div>
    );
}

export default Login;