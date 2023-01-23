import {useAuthContext} from "../contexts/AuthContext";
import {Navigate} from "react-router-dom";
import AppRoutes from "./AppRoutes";

const GuestRoute = () => {
    const authUser = useAuthContext();

    return authUser? (
        <AppRoutes />
    ) : (
        <Navigate to="/" replace />
    )
}

export default GuestRoute