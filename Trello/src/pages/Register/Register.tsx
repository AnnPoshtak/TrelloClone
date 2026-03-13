import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useRegister } from "../../hooks/UseRegister/UseRegister";

function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");

    const { Register } = useRegister();

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        Register(email, password, repeatPassword);
    };

    return (
        <div className="auth-container">
            <h1>Registration</h1>
            <form onSubmit={handleRegister} className="auth-form">
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
                <input
                    type="password"
                    placeholder="Repeat Password"
                    value={repeatPassword}
                    onChange={(e) => setRepeatPassword(e.target.value)}
                />

                <button type="submit">Sign up</button>
            </form>
            <p>Already have an account? <Link to="/login">Sign in</Link></p>
        </div>
    );
}

export default Register;