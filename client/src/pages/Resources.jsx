import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Sidebar from "../components/Sidebar";

function Resources({ darkMode, setDarkMode }) {

    const navigate = useNavigate();

    const [resources, setResources] = useState([]);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("");

    const fetchResources = async () => {

        try {

            const token = localStorage.getItem("token");

            const res = await axios.get(
                "http://localhost:5000/api/resources",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setResources(res.data);

        } catch (err) {

            console.log(err);

        }

    };

    useEffect(() => {

        fetchResources();

    }, []);

    const filteredResources = resources.filter((resource) => {

        return (

            resource.name
                .toLowerCase()
                .includes(search.toLowerCase()) &&

            (filter === "" || resource.type === filter)

        );

    });

    return (

        <div
            className={`
                flex
                min-h-screen
                transition-all
                duration-300
                ${
                    darkMode
                        ? "bg-slate-950 text-white"
                        : "bg-gray-100 text-black"
                }
            `}
        >

            <Sidebar
                darkMode={darkMode}
                setDarkMode={setDarkMode}
            />

            <div className="ml-64 p-10 w-full">

                <h1 className="text-5xl font-bold mb-10">
                    Resources
                </h1>

                <div className="flex gap-4 mb-10">

                    <input
                        type="text"
                        placeholder="Search resources..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                        className="
                            p-4
                            rounded-xl
                            w-80
                            shadow-lg
                            outline-none
                            bg-white
                            text-black
                            dark:bg-slate-800
                            dark:text-white
                        "
                    />

                    <select
                        value={filter}
                        onChange={(e) =>
                            setFilter(e.target.value)
                        }
                        className="
                            p-4
                            rounded-xl
                            shadow-lg
                            outline-none
                            bg-white
                            text-black
                            dark:bg-slate-800
                            dark:text-white
                        "
                    >

                        <option value="">
                            All Types
                        </option>

                        <option value="Bus">
                            Bus
                        </option>

                        <option value="Parking">
                            Parking
                        </option>

                        <option value="Library Room">
                            Library Room
                        </option>

                        <option value="Sports Equipment">
                            Sports Equipment
                        </option>

                        <option value="Lab">
                            Lab
                        </option>

                    </select>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    {
                        filteredResources.map((resource) => (

                            <div
                                key={resource.id}
                                className="
                                    p-8
                                    rounded-3xl
                                    shadow-xl
                                    transition
                                    hover:scale-105
                                    duration-300
                                    bg-white
                                    dark:bg-slate-800
                                    border
                                    border-gray-200
                                    dark:border-slate-700
                                "
                            >

                                <h2 className="text-3xl font-bold mb-6 text-cyan-500">
                                    {resource.name}
                                </h2>

                                <p
                                    className="
                                        mb-3
                                        text-lg
                                        text-black
                                        dark:text-gray-200
                                    "
                                >
                                    <strong>Type:</strong> {resource.type}
                                </p>

                                <p
                                    className="
                                        mb-8
                                        text-lg
                                        text-black
                                        dark:text-gray-200
                                    "
                                >
                                    <strong>Location:</strong> {resource.location}
                                </p>

                                <button
    onClick={() => navigate("/bookings")}
    className="bg-cyan-500 px-4 py-2 rounded hover:bg-cyan-600"
>

    Book Now

</button>

                            </div>

                        ))
                    }

                </div>

            </div>

        </div>

    );

}

export default Resources;