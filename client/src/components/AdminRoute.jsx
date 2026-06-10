import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function AdminRoute({ children }) {

    const { user, loading, isAuthenticated } = useContext(AuthContext);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!isAuthenticated || user?.role !== "admin") {

        return <Navigate to="/dashboard" />;

    }

    return children;
}

export default AdminRoute;