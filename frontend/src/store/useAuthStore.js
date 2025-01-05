import { create } from "zustand";
import { axiosInstance } from "../libs/axios";

export const useAuthStore = create((set) => ({
    user: null,
    isSigningUp: false,
    isLoggingIn: false,
    isCheckingAuth: true,
    isChangingPic: false,
    onlineUsers:[],
    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/authenticated");
            set({ user: res.data.user });
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
            console.log(res.data.user);
            addToast("Logged In Successfully", "success");
        } catch (error) {
            console.log("Error", error);
            addToast(error, "danger");
        } finally {
            set({ isLogginIn: false });
        }
    },
    logout: async (addToast) => {
        try {
            await axiosInstance.post("/auth/logout");
            set({ user: null });
            addToast("Logged Out Successfully", "success");
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
            addToast("Profile picture changed successfully","success");
        } catch (error) {
            console.log("Error", error);
            addToast(error.response.data.message, "danger");
        } finally {
            set({ isChangingPic: false });
        }
    },
}));
