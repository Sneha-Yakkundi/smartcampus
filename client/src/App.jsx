import { useEffect, useState } from "react";

import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Resources from "./pages/Resources";
import Bookings from "./pages/Bookings";
import Analytics from "./pages/Analytics";
import CreateResource from "./pages/CreateResource";
import CalendarPage from "./pages/CalendarPage";
import Availability from "./pages/Availability";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

function App() {

    const [darkMode, setDarkMode] = useState(() => {
        // Initialize from localStorage
        const saved = localStorage.getItem("darkMode");
        return saved !== null ? JSON.parse(saved) : true;
    });

    useEffect(() => {
        // Apply dark class to html element
        if (darkMode) {
            document.documentElement.classList.add("dark");
            document.body.style.backgroundColor = "#0f172a";
        } else {
            document.documentElement.classList.remove("dark");
            document.body.style.backgroundColor = "#f8fafc";
        }
        
        // Save preference to localStorage
        localStorage.setItem("darkMode", JSON.stringify(darkMode));

    }, [darkMode]);

    return (

        <div className={`min-h-screen transition-colors duration-300 ${
            darkMode 
                ? "bg-slate-950 text-white" 
                : "bg-slate-50 text-slate-900"
        }`}>

            <BrowserRouter>

                <Routes>

                    <Route
                        path="/"
                        element={
                            <Login
                                darkMode={darkMode}
                                setDarkMode={setDarkMode}
                            />
                        }
                    />

                    <Route
                        path="/register"
                        element={
                            <Register
                                darkMode={darkMode}
                                setDarkMode={setDarkMode}
                            />
                        }
                    />

                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <Dashboard
                                    darkMode={darkMode}
                                    setDarkMode={setDarkMode}
                                />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/resources"
                        element={
                            <ProtectedRoute>
                                <Resources
                                    darkMode={darkMode}
                                    setDarkMode={setDarkMode}
                                />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/bookings"
                        element={
                            <ProtectedRoute>
                                <Bookings
                                    darkMode={darkMode}
                                    setDarkMode={setDarkMode}
                                />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/analytics"
                        element={
                            <ProtectedRoute>
                                <Analytics
                                    darkMode={darkMode}
                                    setDarkMode={setDarkMode}
                                />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/create-resource"
                        element={
                            <ProtectedRoute role="admin">
                                <CreateResource
                                    darkMode={darkMode}
                                    setDarkMode={setDarkMode}
                                />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/calendar"
                        element={
                            <ProtectedRoute>
                                <CalendarPage
                                    darkMode={darkMode}
                                    setDarkMode={setDarkMode}
                                />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/availability"
                        element={
                            <ProtectedRoute>
                                <Availability
                                    darkMode={darkMode}
                                    setDarkMode={setDarkMode}
                                />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin"
                        element={
                            <ProtectedRoute role="admin">
                                <AdminDashboard
                                    darkMode={darkMode}
                                    setDarkMode={setDarkMode}
                                />
                            </ProtectedRoute>
                        }
                    />

                </Routes>

            </BrowserRouter>

        </div>

    );

}

export default App;