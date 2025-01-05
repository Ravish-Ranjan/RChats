import { create } from "zustand";
import { axiosInstance } from "../libs/axios";

export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,
    isSendingMessage: false,
    getUsers: async (addToast) => {
        set({ isUsersLoading: true });
        try {
            const res = await axiosInstance.get("/message/users");
            set({ users: res.data });
            console.log(res);
        } catch (error) {
            console.log("Error messages", error);
            addToast(error.response.data.message, "danger");
        } finally {
            set({ isUsersLoading: false });
        }
    },
    getMessages: async (userId, addToast) => {
        set({ isMessagesLoading: true });
        try {
            const res = await axiosInstance.get(`/message/${userId}`);
            set({ messages: res.data });
            console.log(res.data);
        } catch (error) {
            console.log("Error messages", error);
            addToast(error.response.data.message, "danger");
        } finally {
            set({ isMessagesLoading: false });
        }
    },
    // todo optimize
    setSelectedUser: (selUser) => {
        set({ selectedUser: selUser });
    },
    sendMessage: async (messageData, addToast) => {
        set({ isSendingMessage: true });
        const { selectedUser, messages } = get();
        try {
            const res = await axiosInstance.post(
                `/message/send/${selectedUser._id}`,
                messageData
            );
            set({ messages: [...messages, res.data] });
        } catch (error) {
            addToast(error.response.data.message, "danger");
        } finally {
            set({ isSendingMessage: false });
        }
    },
}));
