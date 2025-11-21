import { Routes, Route } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";
import { useThemeStore } from "./store/useThemeStore";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import { Loader } from "lucide-react";

function App() {
    const { theme } = useThemeStore();
    return (
        <div data-theme={theme}>
            <Navbar />

            <Routes>
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <HomePage />
                        </ProtectedRoute>       // else login page
                    }
                />
                <Route 
                    path="/login" 
                    element={
                        <LoginPage />
                    } 
                />
                <Route 
                    path="/signup" 
                    element={
                        <SignUpPage />
                    } 
                />
                <Route 
                    path="/settings" 
                    element={
                        <SettingsPage />
                    } 
                />
                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <ProfilePage />
                        </ProtectedRoute>
                    }
                />
            </Routes>

            <Toaster />
        </div>
    );
}

export default App;
