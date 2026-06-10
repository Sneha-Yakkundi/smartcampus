import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import API from "../services/api";
import { toast } from "react-toastify";

function AdminDashboard({ darkMode, setDarkMode }) {

    const [pendingBookings, setPendingBookings] = useState([]);
    const [adminNotes, setAdminNotes] = useState({});

    const fetchPendingBookings = async () => {
        try {
            const res = await API.get("/bookings/pending");
            setPendingBookings(res.data);
        } catch (err) {
            console.log(err);
            toast.error("Failed to fetch pending bookings");
        }
    };

    useEffect(() => {
        fetchPendingBookings();
    }, []);

    const approveBooking = async (bookingId) => {
        try {
            await API.put(`/bookings/${bookingId}/approve`, {
                adminNotes: adminNotes[bookingId] || null
            });
            toast.success("Booking approved!");
            fetchPendingBookings();
        } catch (err) {
            toast.error("Failed to approve booking");
            console.log(err);
        }
    };

    const rejectBooking = async (bookingId) => {
        try {
            await API.put(`/bookings/${bookingId}/reject`, {
                adminNotes: adminNotes[bookingId] || null
            });
            toast.success("Booking rejected!");
            fetchPendingBookings();
        } catch (err) {
            toast.error("Failed to reject booking");
            console.log(err);
        }
    };

    return (
        <div className={`flex min-h-screen transition duration-300 ${
            darkMode 
                ? "bg-slate-950 text-white" 
                : "bg-gray-100 text-slate-900"
        }`}>

            <Sidebar darkMode={darkMode} setDarkMode={setDarkMode} />

            <div className="ml-64 w-full">

                <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

                <div className="p-10">

                    <h1 className="text-4xl font-bold mb-2">
                        Admin Dashboard - Approval Workflow
                    </h1>

                    <p className={`mb-10 text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                        Total Pending Bookings: <span className="font-bold text-lg text-cyan-400">{pendingBookings.length}</span>
                    </p>

                    {pendingBookings.length === 0 ? (
                        <div className={`p-8 rounded-lg text-center ${darkMode ? "bg-slate-800" : "bg-white"}`}>
                            <p className="text-lg">No pending bookings to approve</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                            {pendingBookings.map((booking) => (

                                <div
                                    key={booking.id}
                                    className={`p-6 rounded-lg shadow-lg transition duration-300 border-l-4 border-yellow-500 ${
                                        darkMode
                                            ? "bg-slate-800"
                                            : "bg-white"
                                    }`}
                                >

                                    <div className="mb-4">
                                        <p className="text-sm text-gray-400">Booking ID</p>
                                        <p className="text-2xl font-bold text-cyan-400">#{booking.id}</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-4">

                                        <div>
                                            <p className="text-xs text-gray-400">Requestor</p>
                                            <p className="font-bold">{booking.User?.name}</p>
                                            <p className="text-xs text-gray-400">{booking.User?.email}</p>
                                            <p className="text-xs"><span className={`px-2 py-1 rounded ${booking.User?.role === "faculty" ? "bg-orange-500" : "bg-blue-500"}`}>{booking.User?.role.toUpperCase()}</span></p>
                                        </div>

                                        <div>
                                            <p className="text-xs text-gray-400">Resource</p>
                                            <p className="font-bold">{booking.Resource?.name}</p>
                                            <p className="text-xs text-gray-400">{booking.Resource?.location}</p>
                                        </div>

                                    </div>

                                    <div className="grid grid-cols-3 gap-2 mb-4 text-sm">
                                        <div>
                                            <p className="text-xs text-gray-400">Date</p>
                                            <p className="font-bold">{booking.date}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400">Start Time</p>
                                            <p className="font-bold">{booking.startTime}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400">End Time</p>
                                            <p className="font-bold">{booking.endTime}</p>
                                        </div>
                                    </div>

                                    {/* Priority Badge */}
                                    <div className="mb-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                            booking.priority === 2 ? "bg-orange-500 text-white" : "bg-blue-500 text-white"
                                        }`}>
                                            Priority: {booking.priority === 2 ? "FACULTY" : "STUDENT"}
                                        </span>
                                    </div>

                                    {/* Admin Notes Input */}
                                    <textarea
                                        placeholder="Add approval/rejection notes..."
                                        value={adminNotes[booking.id] || ""}
                                        onChange={(e) => setAdminNotes({
                                            ...adminNotes,
                                            [booking.id]: e.target.value
                                        })}
                                        className={`w-full p-2 rounded text-sm mb-4 ${
                                            darkMode
                                                ? "bg-slate-700 text-white"
                                                : "bg-gray-100 text-black"
                                        }`}
                                        rows="2"
                                    />

                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => approveBooking(booking.id)}
                                            className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded transition"
                                        >
                                            ✓ Approve
                                        </button>
                                        <button
                                            onClick={() => rejectBooking(booking.id)}
                                            className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2 rounded transition"
                                        >
                                            ✕ Reject
                                        </button>
                                    </div>

                                </div>

                            ))}

                        </div>
                    )}

                </div>

            </div>

        </div>
    );

}

export default AdminDashboard;