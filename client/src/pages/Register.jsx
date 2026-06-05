import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

function Register({ darkMode, setDarkMode }) {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        adminKey: ""
    });

    const [showAdminKey, setShowAdminKey] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Build payload - only send adminKey if provided
        const payload = {
            name: formData.name,
            email: formData.email,
            password: formData.password
        };

        if (showAdminKey && formData.adminKey) {
            payload.adminKey = formData.adminKey;
        }

        try {
            const response = await axios.post(
                "http://localhost:5000/api/auth/register",
                payload
            );

            toast.success(
                response.data.user.role === "admin"
                    ? "Admin account created successfully!"
                    : "Student account created successfully!"
            );

            navigate("/");

        } catch (err) {
            toast.error(
                err.response?.data?.message ||
                err.response?.data?.error ||
                "Registration Failed"
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
                    Register
                </h1>

                <form onSubmit={handleSubmit}>

                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className={`w-full p-3 mb-4 rounded transition-colors ${
                            darkMode
                                ? "bg-slate-700 text-white placeholder-gray-400"
                                : "bg-gray-100 text-black placeholder-gray-600"
                        }`}
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
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
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className={`w-full p-3 mb-4 rounded transition-colors ${
                            darkMode
                                ? "bg-slate-700 text-white placeholder-gray-400"
                                : "bg-gray-100 text-black placeholder-gray-600"
                        }`}
                    />

                    {/* Admin Key Toggle */}
                    <div className={`mb-4 p-3 rounded transition-colors ${
                        darkMode
                            ? "bg-slate-700"
                            : "bg-gray-100"
                    }`}>
                        <label className={`flex items-center cursor-pointer ${
                            darkMode
                                ? "text-gray-300"
                                : "text-gray-700"
                        }`}>
                            <input
                                type="checkbox"
                                checked={showAdminKey}
                                onChange={(e) => setShowAdminKey(e.target.checked)}
                                className="mr-2 w-4 h-4"
                            />
                            Register as Admin (Optional)
                        </label>
                        <p className={`text-xs mt-1 ${
                            darkMode
                                ? "text-gray-400"
                                : "text-gray-600"
                        }`}>
                            Requires admin key
                        </p>
                    </div>

                    {/* Admin Key Input - Show only if toggled */}
                    {showAdminKey && (
                        <input
                            type="password"
                            name="adminKey"
                            placeholder="Admin Secret Key"
                            value={formData.adminKey}
                            onChange={handleChange}
                            className={`w-full p-3 mb-4 rounded border-2 transition-colors border-yellow-500 ${
                                darkMode
                                    ? "bg-slate-600 text-white placeholder-gray-400"
                                    : "bg-yellow-50 text-black placeholder-yellow-700"
                            }`}
                        />
                    )}

                    <button
                        type="submit"
                        className="w-full bg-cyan-500 p-3 rounded font-bold hover:bg-cyan-600 text-white transition"
                    >
                        Register
                    </button>

                </form>

                <p className={`text-center mt-4 text-sm ${
                    darkMode
                        ? "text-gray-400"
                        : "text-gray-600"
                }`}>
                    By default, all new users register as <span className="text-cyan-400 font-bold">Students</span>.
                </p>

                <p className={`text-center mt-4 ${
                    darkMode
                        ? "text-gray-300"
                        : "text-gray-700"
                }`}>
                    Already have an account?
                    <Link
                        to="/"
                        className="text-cyan-400 ml-2 hover:text-cyan-300"
                    >
                        Login
                    </Link>
                </p>

            </div>
        </div>
    );

}

export default Register;