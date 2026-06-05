import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

function Login({ darkMode, setDarkMode }) {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({

        email: "",
        password: ""

    });

    const handleChange = (e) => {

        setFormData({

            ...formData,
            [e.target.name]: e.target.value

        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const res = await axios.post(

                "http://localhost:5000/api/auth/login",

                formData

            );

            localStorage.setItem("token", res.data.token);

            localStorage.setItem("role", res.data.user.role);

            toast.success("Login Successful");

            navigate("/dashboard");

        } catch (err) {

            toast.error(

                err.response?.data?.message ||

                "Login Failed"

            );

        }

    };

    return (

        <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
            darkMode
                ? "bg-slate-950"
                : "bg-slate-100"
        }`}>

            <div className={`p-10 rounded-2xl shadow-lg w-96 transition-colors ${
                darkMode
                    ? "bg-slate-800"
                    : "bg-white"
            }`}>

                <h1 className={`text-3xl font-bold mb-6 text-center ${
                    darkMode
                        ? "text-white"
                        : "text-slate-900"
                }`}>
                    Login
                </h1>

                <form onSubmit={handleSubmit}>

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        onChange={handleChange}
                        required
                        className={`w-full p-3 mb-4 rounded transition-colors ${
                            darkMode
                                ? "bg-slate-700 text-white placeholder-gray-400"
                                : "bg-gray-100 text-black placeholder-gray-600"
                        }`}
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        onChange={handleChange}
                        required
                        className={`w-full p-3 mb-6 rounded transition-colors ${
                            darkMode
                                ? "bg-slate-700 text-white placeholder-gray-400"
                                : "bg-gray-100 text-black placeholder-gray-600"
                        }`}
                    />

                    <button
                        type="submit"
                        className="w-full bg-cyan-500 p-3 rounded font-bold hover:bg-cyan-600 text-white transition"
                    >
                        Login
                    </button>

                </form>

                <p className={`text-center mt-4 ${
                    darkMode
                        ? "text-gray-400"
                        : "text-gray-600"
                }`}>

                    Don't have an account?

                    <Link
                        to="/register"
                        className="text-cyan-400 ml-2 hover:text-cyan-300"
                    >
                        Register
                    </Link>

                </p>

            </div>

        </div>

    );

}

export default Login;
