import { Navigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function ProtectedRoute({ children, role }) {

    const { isAuthenticated, user, loading } = useContext(AuthContext);
    const location = useLocation();

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen text-white text-xl">Loading authentication...</div>;
    }

    if (!isAuthenticated) {

        return <Navigate to="/" state={{ from: location }} />;

    }

    if (role && role !== user?.role) {

        return <Navigate to="/dashboard" />;

    }

    return children;

}

export default ProtectedRoute;