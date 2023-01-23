import {useAuthContext} from "../contexts/AuthContext";
import {Navigate} from "react-router-dom";

const ProtectedRoutes = () => {
    const authUser = useAuthContext();

    return authUser ? (
        <Navigate to="/login" replace />
        //   <AppRoutes />
    ) : (
        <Navigate to="/login" replace />
    );
};
export default ProtectedRoutes