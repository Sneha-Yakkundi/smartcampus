import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

import Sidebar from "../components/Sidebar";

import { toast } from "react-toastify";

function CreateBooking({ darkMode, setDarkMode }) {

    const { resourceId } = useParams();

    const navigate = useNavigate();

    const [date, setDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");

    // LOADING STATE
    const [loading, setLoading] = useState(false);

    const createBooking = async () => {

        try {

            // VALIDATION
            if (!date || !startTime || !endTime) {

                toast.error("Please fill all fields");
                return;

            }

            // TIME VALIDATION
            if (startTime >= endTime) {

                toast.error("End time must be greater than start time");
                return;

            }

            setLoading(true);

            const token = localStorage.getItem("token");

            const response = await axios.post(

                "http://localhost:5000/api/bookings",

                {
                    resourceId,
                    date,
                    startTime,
                    endTime
                },

                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }

            );

            setLoading(false);

            toast.success(response.data.message);

            navigate("/bookings");

        } catch (err) {

            console.log(err);

            setLoading(false);

            // SHOW BACKEND ERROR
            if (err.response?.data?.message) {

                toast.error(err.response.data.message);

            } else {

                toast.error("Booking Failed");

            }

        }

    };

    return (

        <div className="flex bg-slate-950 min-h-screen text-white">

            <Sidebar
                darkMode={darkMode}
                setDarkMode={setDarkMode}
            />

            <div className="ml-64 p-10 w-full">

                <h1 className="text-4xl font-bold mb-8">
                    Create Booking
                </h1>

                <div className="bg-slate-800 p-8 rounded-2xl w-[400px]">

                    <input
                        type="date"
                        value={date}
                        onChange={(e) =>
                            setDate(e.target.value)
                        }
                        className="w-full p-3 mb-4 rounded bg-slate-700"
                    />

                    <input
                        type="time"
                        value={startTime}
                        onChange={(e) =>
                            setStartTime(e.target.value)
                        }
                        className="w-full p-3 mb-4 rounded bg-slate-700"
                    />

                    <input
                        type="time"
                        value={endTime}
                        onChange={(e) =>
                            setEndTime(e.target.value)
                        }
                        className="w-full p-3 mb-4 rounded bg-slate-700"
                    />

                    <button
                        onClick={createBooking}
                        disabled={loading}
                        className="bg-cyan-500 px-4 py-2 rounded hover:bg-cyan-600 w-full"
                    >
                        {loading ? "Creating..." : "Create Booking"}
                    </button>

                </div>

            </div>

        </div>

    );

}

export default CreateBooking;