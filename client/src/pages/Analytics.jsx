import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from "recharts";

import Sidebar from "../components/Sidebar";

function Analytics({ darkMode, setDarkMode }) {
    const bookingData = [

        {
            name: "Pending",
            value: 5
        },

        {
            name: "Approved",
            value: 12
        },

        {
            name: "Rejected",
            value: 2
        }

    ];

    const resourceData = [

        {
            name: "Labs",
            bookings: 10
        },

        {
            name: "Library",
            bookings: 7
        },

        {
            name: "Parking",
            bookings: 15
        },

        {
            name: "Sports",
            bookings: 4
        }

    ];

    const COLORS = [

        "#06b6d4",
        "#22c55e",
        "#ef4444"

    ];

    return (

        <div className="flex bg-slate-950 min-h-screen text-white">

            <Sidebar
    darkMode={darkMode}
    setDarkMode={setDarkMode}
/>

            <div className="ml-64 p-10 w-full">

                <h1 className="text-5xl font-bold mb-10">
                    Analytics Dashboard
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

                    <div className="bg-slate-800 p-8 rounded-2xl shadow-lg">

                        <h2 className="text-2xl font-bold mb-6">
                            Booking Status
                        </h2>

                        <ResponsiveContainer width="100%" height={300}>

                            <PieChart>

                                <Pie
                                    data={bookingData}
                                    dataKey="value"
                                    outerRadius={100}
                                    label
                                >

                                    {
                                        bookingData.map((entry, index) => (

                                            <Cell
                                                key={index}
                                                fill={COLORS[index]}
                                            />

                                        ))
                                    }

                                </Pie>

                                <Tooltip />

                            </PieChart>

                        </ResponsiveContainer>

                    </div>

                    <div className="bg-slate-800 p-8 rounded-2xl shadow-lg">

                        <h2 className="text-2xl font-bold mb-6">
                            Resource Usage
                        </h2>

                        <ResponsiveContainer width="100%" height={300}>

                            <BarChart data={resourceData}>

                                <CartesianGrid strokeDasharray="3 3" />

                                <XAxis dataKey="name" />

                                <YAxis />

                                <Tooltip />

                                <Bar
                                    dataKey="bookings"
                                    fill="#06b6d4"
                                />

                            </BarChart>

                        </ResponsiveContainer>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default Analytics;