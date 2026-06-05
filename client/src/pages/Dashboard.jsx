import { useEffect, useState } from "react";
import axios from "axios";

import Sidebar from "../components/Sidebar";

function Dashboard({ darkMode, setDarkMode }) {

    const [stats, setStats] = useState({

        totalResources: 0,
        totalBookings: 0,
        pendingBookings: 0,
        approvedBookings: 0

    });

    const fetchStats = async () => {

        try {

            const res = await axios.get(
                "http://localhost:5000/api/dashboard/stats"
            );

            setStats(res.data);

        } catch (err) {

            console.log(err);

        }

    };

    useEffect(() => {

        fetchStats();

    }, []);

    return (

        <div className="flex min-h-screen dark:text-white text-black transition duration-300">

            <Sidebar
                darkMode={darkMode}
                setDarkMode={setDarkMode}
            />

            <div className="ml-64 p-10 w-full">

                <h1 className="text-5xl font-bold mb-10 dark:text-white text-black">
                    Smart Campus Dashboard
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

                    {/* TOTAL RESOURCES */}

                    <div className="dark:bg-slate-800 bg-white p-8 rounded-3xl shadow-xl hover:scale-105 transition duration-300">

                        <h2 className="text-2xl font-bold dark:text-white text-black">
                            Total Resources
                        </h2>

                        <p className="text-6xl font-bold mt-6 dark:text-cyan-400 text-cyan-700">
                            {stats.totalResources}
                        </p>

                    </div>

                    {/* TOTAL BOOKINGS */}

                    <div className="dark:bg-slate-800 bg-white p-8 rounded-3xl shadow-xl hover:scale-105 transition duration-300">

                        <h2 className="text-2xl font-bold dark:text-white text-black">
                            Total Bookings
                        </h2>

                        <p className="text-6xl font-bold mt-6 dark:text-green-400 text-green-700">
                            {stats.totalBookings}
                        </p>

                    </div>

                    {/* PENDING */}

                    <div className="dark:bg-slate-800 bg-white p-8 rounded-3xl shadow-xl hover:scale-105 transition duration-300">

                        <h2 className="text-2xl font-bold dark:text-white text-black">
                            Pending
                        </h2>

                        <p className="text-6xl font-bold mt-6 dark:text-yellow-400 text-yellow-600">
                            {stats.pendingBookings}
                        </p>

                    </div>

                    {/* APPROVED */}

                    <div className="dark:bg-slate-800 bg-white p-8 rounded-3xl shadow-xl hover:scale-105 transition duration-300">

                        <h2 className="text-2xl font-bold dark:text-white text-black">
                            Approved
                        </h2>

                        <p className="text-6xl font-bold mt-6 dark:text-purple-400 text-purple-700">
                            {stats.approvedBookings}
                        </p>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default Dashboard;