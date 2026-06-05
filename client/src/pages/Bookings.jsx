import { useEffect, useState } from "react";
import axios from "axios";

import Sidebar from "../components/Sidebar";

function Bookings({ darkMode, setDarkMode }) {

    const [bookings, setBookings] = useState([]);

    const [resourceId, setResourceId] = useState("");
    const [date, setDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");

    const fetchBookings = async () => {

        try {

            const res = await axios.get(
                "http://localhost:5000/api/bookings",
                {
                    headers: {
                        Authorization:
                            `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );

            setBookings(res.data);

        } catch (err) {

            console.log(err);

        }

    };

    const createBooking = async () => {

        try {

            await axios.post(
                "http://localhost:5000/api/bookings",
                {
                    resourceId,
                    date,
                    startTime,
                    endTime
                },
                {
                    headers: {
                        Authorization:
                            `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );

            alert("Booking Created Successfully");

            setResourceId("");
            setDate("");
            setStartTime("");
            setEndTime("");

            fetchBookings();

        } catch (err) {

            console.log(err);

            alert("Booking Failed");

        }

    };

    useEffect(() => {

        fetchBookings();

    }, []);

    return (

        <div className={`flex min-h-screen transition-colors duration-300 ${
            darkMode 
                ? "bg-slate-950 text-white" 
                : "bg-slate-50 text-black"
        }`}>

            <Sidebar darkMode={darkMode} setDarkMode={setDarkMode} />

            <div className="ml-64 p-10 w-full">

                <h1 className="text-4xl font-bold mb-8">
                    My Bookings
                </h1>

                {/* CREATE BOOKING FORM */}

                <div className={`p-6 rounded-2xl shadow-lg mb-10 transition-colors ${
                    darkMode
                        ? "bg-slate-800"
                        : "bg-white"
                }`}>

                    <h2 className="text-2xl font-bold mb-6">
                        Create Booking
                    </h2>

                    <input
                        type="number"
                        placeholder="Resource ID"
                        value={resourceId}
                        onChange={(e) =>
                            setResourceId(e.target.value)
                        }
                        className={`w-full p-3 border rounded-lg mb-4 transition-colors ${
                            darkMode
                                ? "bg-slate-700 border-slate-600 text-white"
                                : "bg-white border-gray-300 text-black"
                        }`}
                    />

                    <input
                        type="date"
                        value={date}
                        onChange={(e) =>
                            setDate(e.target.value)
                        }
                        className={`w-full p-3 border rounded-lg mb-4 transition-colors ${
                            darkMode
                                ? "bg-slate-700 border-slate-600 text-white"
                                : "bg-white border-gray-300 text-black"
                        }`}
                    />

                    <input
                        type="time"
                        value={startTime}
                        onChange={(e) =>
                            setStartTime(e.target.value)
                        }
                        className={`w-full p-3 border rounded-lg mb-4 transition-colors ${
                            darkMode
                                ? "bg-slate-700 border-slate-600 text-white"
                                : "bg-white border-gray-300 text-black"
                        }`}
                    />

                    <input
                        type="time"
                        value={endTime}
                        onChange={(e) =>
                            setEndTime(e.target.value)
                        }
                        className={`w-full p-3 border rounded-lg mb-4 transition-colors ${
                            darkMode
                                ? "bg-slate-700 border-slate-600 text-white"
                                : "bg-white border-gray-300 text-black"
                        }`}
                    />

                    <button
                        onClick={createBooking}
                        className="bg-cyan-500 text-white px-6 py-3 rounded-lg hover:bg-cyan-600 transition"
                    >

                        Book Resource

                    </button>

                </div>

                {/* BOOKINGS LIST */}

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

                    {bookings.map((booking) => (

                        <div
                            key={booking.id}
                            className={`p-6 rounded-2xl shadow-lg transition-colors ${
                                darkMode
                                    ? "bg-slate-800"
                                    : "bg-white"
                            }`}
                        >

                            <h2 className="text-2xl font-bold text-cyan-400 mb-4">
                                Booking #{booking.id}
                            </h2>

                            <p className="mb-2">
                                <strong>Resource ID:</strong>{" "}
                                {booking.resourceId}
                            </p>

                            <p className="mb-2">
                                <strong>Date:</strong>{" "}
                                {booking.date}
                            </p>

                            <p className="mb-2">
                                <strong>Start:</strong>{" "}
                                {booking.startTime}
                            </p>

                            <p className="mb-2">
                                <strong>End:</strong>{" "}
                                {booking.endTime}
                            </p>

                            <p>
                                <strong>Status:</strong>{" "}
                                <span className="text-orange-400 font-bold">
                                    {booking.status}
                                </span>
                            </p>

                        </div>

                    ))}

                </div>

            </div>

        </div>

    );

}

export default Bookings;