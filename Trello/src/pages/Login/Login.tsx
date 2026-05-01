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
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#f4f5f7] p-4">
            <h1 className="text-3xl font-bold mb-6 text-[#172b4d]">Login</h1>
            
            <form 
                onSubmit={handleSubmit(onSubmit)}
                className="bg-white p-8 rounded-lg w-full max-w-[320px] flex flex-col gap-4 border border-[#ddd] shadow-sm"
            >
                <div className="flex flex-col gap-1">
                    <input
                        className="p-2.5 border border-[#ddd] rounded focus:outline-none focus:ring-2 focus:ring-[#0052cc] transition-all"
                        type="email"
                        placeholder="Email"
                        {...register("email", { required: "Email is required" })}
                    />
                    {errors.email && <span className="text-red-500 text-xs mt-1">{errors.email.message}</span>}
                </div>

                <div className="flex flex-col gap-1">
                    <input
                        className="p-2.5 border border-[#ddd] rounded focus:outline-none focus:ring-2 focus:ring-[#0052cc] transition-all"
                        type="password"
                        placeholder="Password"
                        {...register("password", { 
                            required: "Password is required",
                            minLength: { value: 6, message: "Min length is 6" }
                        })}
                    />
                    {errors.password && <span className="text-red-500 text-xs mt-1">{errors.password.message}</span>}
                </div>

                <button 
                    type="submit" 
                    className="bg-[#0052cc] text-white py-2.5 rounded font-semibold hover:bg-[#0043a6] active:scale-[0.98] transition-all mt-2"
                >
                    Sign in
                </button>
            </form>

            <p className="mt-4 text-[#172b4d]">
                Don't have an account? 
                <Link to="/register" className="ml-1 text-[#0052cc] hover:underline font-medium">
                    Register
                </Link>
            </p>
        </div>
    );
}

export default Login;