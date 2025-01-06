import { create } from "zustand";
import { axiosInstance } from "../libs/axios";
import { io } from "socket.io-client";

const BASEURL =
    import.meta.env.MODE === "development" ? "http://localhost:5000/" : "/";

export const useAuthStore = create((set, get) => ({
    user: null,
    isSigningUp: false,
    isLoggingIn: false,
    isCheckingAuth: true,
    isChangingPic: false,
    onlineUsers: [],
    socket: null,
    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/authenticated");
            set({ user: res.data.user });
            get().connectSocket();
        } catch (error) {
            console.log("Error ", error);
            set({ user: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },
    signup: async (form, addToast) => {
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post("/auth/signup", form);
            set({ user: res.data.user });
            addToast("Account created Successfully", "success");
            get().connectSocket();
        } catch (error) {
            console.log("Error", error);
            addToast(error.response.data.message, "danger");
        } finally {
            set({ isSigningUp: false });
        }
    },
    login: async (form, addToast) => {
        set({ isLogginIn: true });
        try {
            const res = await axiosInstance.post("/auth/login", form);
            set({ user: res.data.user });
            addToast("Logged In Successfully", "success");
            get().connectSocket();
        } catch (error) {
            console.log("Error", error);
            addToast(error.response.data.message, "danger");
        } finally {
            set({ isLogginIn: false });
        }
    },
    logout: async (addToast) => {
        try {
            await axiosInstance.post("/auth/logout");
            set({ user: null });
            addToast("Logged Out Successfully", "success");
            get().disconnectSocket();
        } catch (error) {
            console.log("Error", error);
            addToast(error.response.data.message, "danger");
        }
    },
    changepic: async (data, addToast) => {
        set({ isChangingPic: true });
        try {
            const res = await axiosInstance.put("/auth/changeprofilepic", data);
            set({ user: res.data.user });
            addToast("Profile picture changed successfully", "success");
        } catch (error) {
            console.log("Error", error);
            addToast(error.response.data.message, "danger");
        } finally {
            set({ isChangingPic: false });
        }
    },
    connectSocket: () => {
        const { user } = get();
        if (!user || get().socket?.connected) return;
        const socket = io(BASEURL, {
            query: {
                userId: user._id,
            },
        });
        socket.connect();
        set({ socket: socket });
        socket.on("getOnlineUsers", (usersIds) => {
            set({ onlineUsers: usersIds });
        });
    },
    disconnectSocket: () => {
        if (get().socket?.connected) {
            get().socket.disconnect();
        }
    },
}));
