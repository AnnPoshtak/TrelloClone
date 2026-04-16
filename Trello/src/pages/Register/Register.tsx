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
        <div className="auth-container">
            <h1>Registration</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
                <input
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
                {errors.email && <p className="error-msg">{errors.email.message}</p>}

                <input
                    type="password"
                    placeholder="Password"
                    {...register("password", { 
                        required: "Password is required",
                        minLength: { value: 6, message: "Min length is 6 characters" }
                    })}
                />
                {errors.password && <p className="error-msg">{errors.password.message}</p>}
                <input
                    type="password"
                    placeholder="Repeat Password"
                    {...register("repeatPassword", { 
                        required: "Please repeat your password",
                        validate: (value) => value === passwordValue || "Passwords do not match"
                    })}
                />
                {errors.repeatPassword && <p className="error-msg">{errors.repeatPassword.message}</p>}

                <button type="submit">Sign up</button>
            </form>
            <p>Already have an account? <Link to="/login">Sign in</Link></p>
        </div>
    );
}

export default Register;