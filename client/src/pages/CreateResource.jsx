import { useState } from "react";
import axios from "axios";

import Sidebar from "../components/Sidebar";

function CreateResource({ darkMode, setDarkMode }) {

    const [name, setName] = useState("");
    const [type, setType] = useState("");
    const [location, setLocation] = useState("");

    const createResource = async () => {

        try {

            const token = localStorage.getItem("token");

            await axios.post(

                "http://localhost:5000/api/resources",

                {
                    name,
                    type,
                    location
                },

                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }

            );

            alert("Resource Created");

            setName("");
            setType("");
            setLocation("");

        } catch (err) {

            console.log(err);

            alert("Failed");

        }

    };

    return (

        <div className="flex min-h-screen dark:bg-slate-950 bg-gray-100 transition duration-300">

            <Sidebar
                darkMode={darkMode}
                setDarkMode={setDarkMode}
            />

            <div className="ml-64 p-10 w-full">

                <h1 className="text-5xl font-bold mb-10 dark:text-white text-black">
                    Create Resource
                </h1>

                <div className="dark:bg-slate-800 bg-white p-10 rounded-3xl shadow-xl max-w-xl">

                    <input
                        type="text"
                        placeholder="Resource Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-4 rounded-xl mb-5 dark:bg-slate-700 bg-gray-100 dark:text-white text-black"
                    />

                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="w-full p-4 rounded-xl mb-5 dark:bg-slate-700 bg-gray-100 dark:text-white text-black"
                    >

                        <option value="">
                            Select Type
                        </option>

                        <option value="Classroom">
                            Classroom
                        </option>

                        <option value="Lab">
                            Lab
                        </option>

                        <option value="Library Room">
                            Library Room
                        </option>

                        <option value="Bus">
                            Bus
                        </option>

                        <option value="Parking">
                            Parking
                        </option>

                        <option value="Sports Equipment">
                            Sports Equipment
                        </option>

                    </select>

                    <input
                        type="text"
                        placeholder="Location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full p-4 rounded-xl mb-5 dark:bg-slate-700 bg-gray-100 dark:text-white text-black"
                    />

                    <button
                        onClick={createResource}
                        className="bg-cyan-500 hover:bg-cyan-600 px-6 py-3 rounded-xl text-white font-bold transition duration-300"
                    >
                        Create Resource
                    </button>

                </div>

            </div>

        </div>

    );

}

export default CreateResource;