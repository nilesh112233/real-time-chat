import { useAuthStore } from "../store/useAuthStore";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import { Navigate } from "react-router-dom";
import { useState } from "react";

function ProtectedRoute({ children }) {
    const { counter, increaseCounter, authUser, checkAuth, isAuthenticated, isCheckingAuth } = useAuthStore();

    // useEffect(() => {
    //     increaseCounter();
    //     const fetchAuth = async () => {
    //         await checkAuth();
    //     };

    //     if (!isAuthenticated || !authUser) fetchAuth();

    //     console.log(authUser);
    //     console.log(`counter = ${counter}`);
    // }, [isAuthenticated]);

    useEffect(() => {
        const fetchAuth = async () => {
            await checkAuth();
        }
        
        if (!isAuthenticated) fetchAuth();
    }, [])


    if (isCheckingAuth) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader className="size-10 animate-spin" />
            </div>
        );
    }

    return (!isAuthenticated || !authUser) ? <Navigate to="/login" /> : children;
}

export default ProtectedRoute;
