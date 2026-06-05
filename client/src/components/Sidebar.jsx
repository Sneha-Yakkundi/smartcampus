import { Link, useNavigate } from "react-router-dom";

import {
    FaTachometerAlt,
    FaBook,
    FaCalendar,
    FaChartBar,
    FaPlusCircle,
    FaCalendarAlt,
    FaSignOutAlt,
    FaMoon,
    FaSun
} from "react-icons/fa";

function Sidebar({ darkMode, setDarkMode }) {

    const navigate = useNavigate();

    const logout = () => {

        localStorage.clear();

        navigate("/");

    };

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    return (

        <div className="w-64 h-screen bg-slate-900 text-white fixed left-0 top-0 p-6 shadow-2xl">

            <h1 className="text-3xl font-bold mb-10 text-cyan-400">
                Smart Campus
            </h1>

            <div className="flex flex-col gap-4">

                <Link
                    to="/dashboard"
                    className="hover:bg-slate-700 p-3 rounded-lg transition duration-300"
                >

                    <div className="flex items-center gap-3 text-lg">

                        <FaTachometerAlt />

                        Dashboard

                    </div>

                </Link>

                <Link
                    to="/resources"
                    className="hover:bg-slate-700 p-3 rounded-lg transition duration-300"
                >

                    <div className="flex items-center gap-3 text-lg">

                        <FaBook />

                        Resources

                    </div>

                </Link>

                <Link
                    to="/bookings"
                    className="hover:bg-slate-700 p-3 rounded-lg transition duration-300"
                >

                    <div className="flex items-center gap-3 text-lg">

                        <FaCalendar />

                        Bookings

                    </div>

                </Link>

                <Link
                    to="/analytics"
                    className="hover:bg-slate-700 p-3 rounded-lg transition duration-300"
                >

                    <div className="flex items-center gap-3 text-lg">

                        <FaChartBar />

                        Analytics

                    </div>

                </Link>

                {
                    localStorage.getItem("role") === "admin" && (

                        <>

                            <Link
                                to="/admin"
                                className="hover:bg-slate-700 p-3 rounded-lg transition duration-300"
                            >

                                <div className="flex items-center gap-3 text-lg">

                                    <FaTachometerAlt />

                                    Admin Dashboard

                                </div>

                            </Link>

                            <Link
                                to="/create-resource"
                                className="hover:bg-slate-700 p-3 rounded-lg transition duration-300"
                            >

                                <div className="flex items-center gap-3 text-lg">

                                    <FaPlusCircle />

                                    Create Resource

                                </div>

                            </Link>

                        </>

                    )
                }

                <Link
                    to="/calendar"
                    className="hover:bg-slate-700 p-3 rounded-lg transition duration-300"
                >

                    <div className="flex items-center gap-3 text-lg">

                        <FaCalendarAlt />

                        Calendar

                    </div>

                </Link>

                <button
                    onClick={toggleDarkMode}
                    className="bg-slate-700 hover:bg-slate-600 p-3 rounded-lg flex items-center gap-3 transition duration-300"
                >

                    {darkMode ? <FaSun /> : <FaMoon />}

                    {darkMode ? "Light Mode" : "Dark Mode"}

                </button>

                <button
                    onClick={logout}
                    className="bg-red-500 hover:bg-red-600 p-3 rounded-lg mt-10 flex items-center gap-3 transition duration-300"
                >

                    <FaSignOutAlt />

                    Logout

                </button>

            </div>

        </div>

    );

}

export default Sidebar;