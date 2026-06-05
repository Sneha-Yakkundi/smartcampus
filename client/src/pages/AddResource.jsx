import { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

function AddResource({ darkMode, setDarkMode }) {

    const [formData, setFormData] = useState({
        name: "",
        type: "",
        location: ""
    });

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const token = localStorage.getItem("token");

            await axios.post(
                "http://localhost:5000/api/resources",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert("Resource Added");

        } catch (err) {

            console.log(err);

        }

    };

    return (

        <div className={`min-h-screen transition-colors duration-300 ${
            darkMode 
                ? "bg-slate-950 text-white" 
                : "bg-slate-50 text-black"
        }`}>

            <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

            <div className="p-10 max-w-2xl mx-auto">

                <h1 className="text-4xl font-bold mb-8">Add Resource</h1>

                <form onSubmit={handleSubmit} className={`p-6 rounded-2xl shadow-lg ${
                    darkMode 
                        ? "bg-slate-800" 
                        : "bg-white"
                }`}>

                    <input
                        type="text"
                        name="name"
                        placeholder="Resource Name"
                        onChange={handleChange}
                        required
                        className={`w-full p-3 mb-4 border rounded-lg transition-colors ${
                            darkMode
                                ? "bg-slate-700 border-slate-600 text-white"
                                : "bg-white border-gray-300 text-black"
                        }`}
                    />

                    <input
                        type="text"
                        name="type"
                        placeholder="Type (Bus, Lab, Parking, etc.)"
                        onChange={handleChange}
                        required
                        className={`w-full p-3 mb-4 border rounded-lg transition-colors ${
                            darkMode
                                ? "bg-slate-700 border-slate-600 text-white"
                                : "bg-white border-gray-300 text-black"
                        }`}
                    />

                    <input
                        type="text"
                        name="location"
                        placeholder="Location"
                        onChange={handleChange}
                        required
                        className={`w-full p-3 mb-6 border rounded-lg transition-colors ${
                            darkMode
                                ? "bg-slate-700 border-slate-600 text-white"
                                : "bg-white border-gray-300 text-black"
                        }`}
                    />

                    <button 
                        type="submit"
                        className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-6 rounded-lg transition"
                    >
                        Add Resource
                    </button>

                </form>

            </div>

        </div>

    );

}

export default AddResource;