import { Link } from "react-router-dom";
import { useRegister } from "../../hooks/useRegister/useRegister";
import { useForm, type SubmitHandler } from "react-hook-form";

interface IRegisterInput {
  email: string;
  password: string;
  repeatPassword: string;
}

function Register() {
    const { 
        register, 
        handleSubmit, 
        watch, 
        formState: { errors } 
    } = useForm<IRegisterInput>();

    const { Register: registerUser } = useRegister();
    const passwordValue = watch("password");

    const onSubmit: SubmitHandler<IRegisterInput> = (data) => {
        registerUser(data.email, data.password, data.repeatPassword);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#f4f5f7] p-4">
            <h1 className="text-3xl font-bold mb-6 text-[#172b4d]">Registration</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-lg w-full max-w-[320px] flex flex-col gap-4 border border-[#ddd] shadow-sm">
                <div className="flex flex-col gap-1">
                    <input
                        className="p-2.5 border border-[#ddd] rounded focus:outline-none focus:ring-2 focus:ring-[#0052cc] transition-all"
                        type="email"
                        placeholder="Email"
                        {...register("email", { 
                            required: "Email is required",
                            pattern: {
                                value: /\S+@\S+\.\S+/,
                                message: "Invalid email format"
                            }
                        })}
                    />
                    {errors.email && (<span className="text-red-500 text-xs mt-1 px-1">{errors.email.message}</span>)}
                </div>

                <div className="flex flex-col gap-1">
                    <input
                        className="p-2.5 border border-[#ddd] rounded focus:outline-none focus:ring-2 focus:ring-[#0052cc] transition-all"
                        type="password"
                        placeholder="Password"
                        {...register("password", { 
                            required: "Password is required",
                            minLength: { value: 6, message: "Min length is 6 characters" }
                        })}
                    />
                    {errors.password && (<span className="text-red-500 text-xs mt-1 px-1">{errors.password.message}</span>)}
                </div>

                <div className="flex flex-col gap-1">
                    <input
                        className="p-2.5 border border-[#ddd] rounded focus:outline-none focus:ring-2 focus:ring-[#0052cc] transition-all"
                        type="password"
                        placeholder="Repeat Password"
                        {...register("repeatPassword", { 
                            required: "Please repeat your password",
                            validate: (value) => value === passwordValue || "Passwords do not match"
                        })}
                    />
                    {errors.repeatPassword && (<span className="text-red-500 text-xs mt-1 px-1">{errors.repeatPassword.message}</span>)}
                </div>

                <button type="submit" className="bg-[#0052cc] text-white py-2.5 rounded font-semibold hover:bg-[#0043a6] active:scale-[0.98] transition-all mt-2">Sign up </button>
            </form>

            <p className="mt-4 text-[#172b4d]">
                Already have an account? 
                <Link to="/login" className="ml-1 text-[#0052cc] hover:underline font-medium">
                    Sign in
                </Link>
            </p>
        </div>
    );
}

export default Register;