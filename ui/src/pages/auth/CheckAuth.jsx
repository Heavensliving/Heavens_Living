import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export const CheckAuth = (Component) => {
    const Wrapper = (props) => {
        const admin = useSelector(store => store.auth.admin);
        const token = admin?.token;
        const isTokenExpired = (token) => {
            if (!token) return true; // If there's no token, consider it expired
            try {
                const decodedToken = jwtDecode(token); // Decode the token
                const currentTime = Date.now() / 1000; // Get current time in seconds
                return decodedToken.exp < currentTime; // Check if the token is expired
            } catch (error) {
                console.error("Invalid token:", error);
                return true; // Consider invalid tokens as expired
            }
        };
        if (!admin || isTokenExpired(token)) {
            return <Navigate to="/login" />;
        }
        const navigate = useNavigate();
        useEffect(() => {
            if (!admin) {
                navigate('/login')
            }
        }, [admin])
        return <Component {...props} />;
    }
    return Wrapper;
}

export default CheckAuth