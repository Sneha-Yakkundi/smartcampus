import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import API from "../services/api";

function AdminDashboard({ darkMode, setDarkMode }) {

    const [bookings, setBookings] = useState([]);

    const fetchBookings = async () => {

        try {

            const res = await API.get("/bookings");

            setBookings(res.data);

        } catch (err) {

            console.log(err);

        }

    };

    useEffect(() => {

        fetchBookings();

    }, []);

    const updateStatus = async (id, status) => {

        try {

            await API.put(`/bookings/${id}/status`, {
                status
            });

            fetchBookings();

        } catch (err) {

            console.log(err);

        }

    };

    return (

        <div className={`min-h-screen transition duration-300 ${
            darkMode 
                ? "bg-slate-950 text-white" 
                : "bg-gray-100 text-slate-900"
        }`}>

            <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

            <div className="p-10">

                <h1 className="text-4xl font-bold mb-10">
                    Admin Dashboard - Manage Bookings
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                    {
                        bookings.map((booking) => (

                            <div
                                key={booking.id}
                                className={`p-6 rounded-lg shadow-lg transition duration-300 ${
                                    darkMode
                                        ? "bg-slate-800 border border-slate-700"
                                        : "bg-white border border-gray-300"
                                }`}
                            >

                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                                    Booking ID: <span className="font-bold text-lg">{booking.id}</span>
                                </p>

                                <p className="text-sm mb-2">
                                    User ID: <span className="font-bold">{booking.userId}</span>
                                </p>

                                <p className="text-sm mb-4">
                                    Status: <span className={`font-bold px-3 py-1 rounded-full ${
                                        booking.status === "approved" 
                                            ? "bg-green-500 text-white" 
                                            : booking.status === "rejected"
                                            ? "bg-red-500 text-white"
                                            : "bg-yellow-500 text-white"
                                    }`}>
                                        {booking.status}
                                    </span>
                                </p>

                                <div className="flex gap-3">

                                    <button
                                        onClick={() =>
                                            updateStatus(
                                                booking.id,
                                                "approved"
                                            )
                                        }
                                        className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-3 rounded transition"
                                    >
                                        Approve
                                    </button>

                                    <button
                                        onClick={() =>
                                            updateStatus(
                                                booking.id,
                                                "rejected"
                                            )
                                        }
                                        className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-3 rounded transition"
                                    >
                                        Reject
                                    </button>

                                </div>

                            </div>

                        ))
                    }

                </div>

            </div>

        </div>

    );

}

export default AdminDashboard;