import { useState } from "react";
import API from "../services/api";

import Sidebar from "../components/Sidebar";

function Availability({ darkMode, setDarkMode }) {

    const [date, setDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");

    const [resources, setResources] = useState([]);

    const searchAvailability = async () => {

        try {

            const res = await API.get(

                `/availability?date=${date}&startTime=${startTime}&endTime=${endTime}`

            );

            setResources(res.data);

        } catch (err) {

            console.log(err);

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
                    Resource Availability
                </h1>

                <div className="bg-slate-800 p-8 rounded-2xl w-[500px]">

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
                        onClick={searchAvailability}
                        className="bg-cyan-500 px-4 py-2 rounded hover:bg-cyan-600 w-full"
                    >
                        Search Availability
                    </button>

                </div>

                <div className="grid grid-cols-3 gap-5 mt-10">

                    {resources.map((resource) => (

                        <div
                            key={resource.id}
                            className="bg-slate-800 p-5 rounded-xl"
                        >

                            <h2 className="text-2xl font-bold mb-3">
                                {resource.name}
                            </h2>

                            <p>
                                Type:
                                <span className="ml-2 text-cyan-400">
                                    {resource.type}
                                </span>
                            </p>

                            <p>
                                Location:
                                <span className="ml-2">
                                    {resource.location}
                                </span>
                            </p>

                            <p className="mt-3 text-green-400">
                                Available
                            </p>

                        </div>

                    ))}

                </div>

            </div>

        </div>

    );

}

export default Availability;