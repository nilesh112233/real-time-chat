import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isAuthenticated: false,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    onlineUsers: [],
    socket: null,

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check");
            set({ 
                authUser: res.data,
                isAuthenticated: true
            });
            get().connectSocket();

        } catch (error) {
            console.log("Error in checkAuth: ", error.message);
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    signup: async (data) => {
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post("/auth/signup", data);
            set({ isAuthenticated: true });
            toast.success("Account created successfully");
            get().connectSocket();
            window.location.href = "/";
        } catch (error) {
            console.log("Error in signup:", error.response.data.message);
            toast.error(error.response.data.message);
            
        } finally {
            set({ isSigningUp: false });
        }
    },

    login: async (data) => {
        set({ isLoggingIn: true});
        try {
            const res = await axiosInstance.post("/auth/login", data);
            set({ isAuthenticated: true });
            toast.success("Logged in successfully");
            get().connectSocket();
            window.location.href = "/";

            // console.log(res.data)
        } catch (error) {
            console.log("Error in login: ", error.response.data.message);
            toast.error(error.response.data.message);
        } finally {
            set({ isLoggingIn: false });
        }
    },

    logout: async () => {
        set({ authUser: null, isAuthenticated: false });
        try {
            const res= await axiosInstance.post("/auth/logout");
            // window.location.href = "/login";
            toast.success("Logged out successfully");
            get().disconnectSocket();
        } catch (error) {
            console.log("Error in logout: ", error.response.data.message);
            toast.error(error.response.data.message);
        }
    },

    updateProfile: async (data) => {
        set({ isUpdatingProfile: true });
        try {
            const res = await axiosInstance.put("/auth/update-profile", data);
            toast.success("Profile picture updated");
            set({ authUser: res.data});
        } catch (error) {
            console.log("Error in updateing profile: ", error.response.data.message);
            toast.error(error.response.data.message);
        } finally {
            set({ isUpdatingProfile: false });
        }
    },

    connectSocket: () => {
    const { authUser, socket } = get();

    if (!authUser) return; 
    if (socket?.connected) return;

    const newSocket = io(import.meta.env.VITE_BASE_URL, {
        query: { userId: authUser._id }
    });

    set({ socket: newSocket });

    newSocket.on("getOnlineUsers", (userIds) => {
        set({ onlineUsers: userIds });
    });
},


    disconnectSocket: () => {
        if (get().socket?.connected) get().socket.disconnect();
    },
}));
