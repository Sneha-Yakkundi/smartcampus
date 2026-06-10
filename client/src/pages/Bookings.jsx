import { useEffect, useState } from "react";
import API from "../services/api";
import { toast } from "react-toastify";

import Sidebar from "../components/Sidebar";

function Bookings({ darkMode, setDarkMode }) {

    const [bookings, setBookings] = useState([]);

    const [resourceId, setResourceId] = useState("");
    const [date, setDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");

    const fetchBookings = async () => {

        try {

            const res = await API.get(
                "/bookings"
            );

            setBookings(res.data);

        } catch (err) {

            console.log(err);

        }

    };

    const createBooking = async () => {

        try {

            await API.post(
                "/bookings",
                {
                    resourceId,
                    date,
                    startTime,
                    endTime
                }
            );

            toast.success("Booking Created Successfully - Pending Admin Approval");

            setResourceId("");
            setDate("");
            setStartTime("");
            setEndTime("");

            fetchBookings();

        } catch (err) {

            console.log(err);

            toast.error(err.response?.data?.error || "Booking Failed");

        }

    };

    const cancelBooking = async (bookingId) => {
        try {
            await API.put(
                `/bookings/${bookingId}/cancel`
            );

            toast.success("Booking cancelled successfully");
            fetchBookings();

        } catch (err) {
            console.log(err);
            toast.error("Failed to cancel booking");
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
                            className={`p-6 rounded-2xl shadow-lg transition-colors border-l-4 ${
                                darkMode
                                    ? "bg-slate-800"
                                    : "bg-white"
                            } ${
                                booking.approvalStatus === "approved" ? "border-green-500" :
                                booking.approvalStatus === "rejected" ? "border-red-500" :
                                "border-yellow-500"
                            }`}
                        >

                            <h2 className="text-2xl font-bold text-cyan-400 mb-4">
                                Booking #{booking.id}
                            </h2>

                            <div className="space-y-2 mb-4">
                                <p className="mb-2">
                                    <strong>Resource:</strong>{" "}
                                    {booking.Resource?.name || "Unknown"}
                                </p>

                                <p className="mb-2">
                                    <strong>Date:</strong>{" "}
                                    {booking.date}
                                </p>

                                <p className="mb-2">
                                    <strong>Time:</strong>{" "}
                                    {booking.startTime} - {booking.endTime}
                                </p>

                                <div className="flex gap-2">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                        booking.approvalStatus === "approved" ? "bg-green-500 text-white" :
                                        booking.approvalStatus === "rejected" ? "bg-red-500 text-white" :
                                        "bg-yellow-500 text-white"
                                    }`}>
                                        {booking.approvalStatus?.toUpperCase()}
                                    </span>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                        booking.priority === 2 ? "bg-orange-500" : "bg-blue-500"
                                    } text-white`}>
                                        {booking.priority === 2 ? "FACULTY" : "STUDENT"}
                                    </span>
                                </div>

                                {booking.adminNotes && (
                                    <p className="text-xs mt-2 p-2 bg-slate-700 rounded">
                                        <strong>Admin Notes:</strong> {booking.adminNotes}
                                    </p>
                                )}
                            </div>

                            {booking.approvalStatus !== "cancelled" && (
                                <button
                                    onClick={() => cancelBooking(booking.id)}
                                    className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 rounded transition"
                                >
                                    Cancel Booking
                                </button>
                            )}

                        </div>

                    ))}

                </div>

            </div>

        </div>

    );

}

export default Bookings;