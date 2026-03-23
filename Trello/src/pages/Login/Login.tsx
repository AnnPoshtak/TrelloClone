import { useState } from "react";
import { Link } from "react-router-dom";
import { useLogin } from "../../hooks/UseLogin/UseLogin.tsx";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const { login } = useLogin();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        login(email, password);
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
                <button type="submit">
                    Sign in
                </button>
            </form>
            <p>Don't have an account? <Link to="/register">Register</Link></p>
        </div>
    );
}

export default Login;