import { Link, useNavigate } from "react-router-dom";
import { FaMoon, FaSun, FaPlusCircle } from "react-icons/fa";

function Navbar({ darkMode, setDarkMode }) {

    const navigate = useNavigate();

    const logout = () => {

        localStorage.clear();

        navigate("/");

    };

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    return (

        <div className={`p-4 flex gap-6 items-center shadow-lg transition duration-300 ${
            darkMode 
                ? "bg-slate-900 text-white" 
                : "bg-white text-slate-900 border-b border-gray-300"
        }`}>

            <Link
                to="/dashboard"
                className={`hover:${darkMode ? "text-cyan-400" : "text-cyan-600"} transition`}
            >
                Dashboard
            </Link>

            <Link
                to="/resources"
                className={`hover:${darkMode ? "text-cyan-400" : "text-cyan-600"} transition`}
            >
                Resources
            </Link>

            <Link
                to="/bookings"
                className={`hover:${darkMode ? "text-cyan-400" : "text-cyan-600"} transition`}
            >
                Bookings
            </Link>

            <Link
                to="/calendar"
                className={`hover:${darkMode ? "text-cyan-400" : "text-cyan-600"} transition`}
            >
                Calendar
            </Link>

            <Link
                to="/analytics"
                className={`hover:${darkMode ? "text-cyan-400" : "text-cyan-600"} transition`}
            >
                Analytics
            </Link>

            {localStorage.getItem("role") === "admin" && (
                <>
                    <Link
                        to="/admin"
                        className={`hover:${darkMode ? "text-cyan-400" : "text-cyan-600"} transition`}
                    >
                        Admin Dashboard
                    </Link>

                    <Link
                        to="/create-resource"
                        className={`flex items-center gap-2 hover:${darkMode ? "text-cyan-400" : "text-cyan-600"} transition`}
                    >
                        <FaPlusCircle /> Create Resource
                    </Link>
                </>
            )}

            <button
                onClick={toggleDarkMode}
                className={`ml-auto px-4 py-2 rounded flex items-center gap-2 transition ${
                    darkMode
                        ? "bg-slate-700 hover:bg-slate-600 text-white"
                        : "bg-gray-200 hover:bg-gray-300 text-slate-900"
                }`}
            >
                {darkMode ? <FaSun /> : <FaMoon />}
                {darkMode ? "Light" : "Dark"}
            </button>

            <button
                onClick={logout}
                className="bg-red-500 px-4 py-2 rounded hover:bg-red-600 text-white transition"
            >
                Logout
            </button>

        </div>

    );

}

export default Navbar;