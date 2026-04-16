import { Link } from "react-router-dom";
import { useLogin } from "../../hooks/useLogin/useLogin.tsx";
import { useForm, type SubmitHandler } from "react-hook-form";

interface IFormInput {
  email: string;   
  password: string;
}

function Login() {
    const { 
        register, 
        handleSubmit, 
        formState: { errors } 
    } = useForm<IFormInput>();

    const { login } = useLogin();

    const onSubmit: SubmitHandler<IFormInput> = (data) => {
        login(data.email, data.password);
    };

    return (
        <div className="auth-container">
            <h1>Login</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
                <input
                    type="email"
                    placeholder="Email"
                    {...register("email", { required: "Email is required" })}
                />
                {errors.email && <span className="error">{errors.email.message}</span>}

                <input
                    type="password"
                    placeholder="Password"
                    {...register("password", { 
                        required: "Password is required",
                        minLength: { value: 6, message: "Min length is 6" }
                    })}
                />
                {errors.password && <span className="error">{errors.password.message}</span>}

                <button type="submit">
                    Sign in
                </button>
            </form>
            <p>Don't have an account? <Link to="/register">Register</Link></p>
        </div>
    );
}

export default Login;