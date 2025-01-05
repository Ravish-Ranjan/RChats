import { useEffect, useRef, useState } from "react";
import { useChatStore } from "../../store/useChatStore";
import PropTypes from "prop-types";
import { useAuthStore } from "../../store/useAuthStore";
import { Button, InputGroup } from "@blueprintjs/core";
import NoChat from "./NoChat";

const formatMongoDate = (mongoDateString) => {
    const date = new Date(mongoDateString);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();
    let meredian = "AM";
    let hours = date.getHours();
    if (date.getHours() > 11) {
        meredian = "PM";
        hours -= 12;
    }
    const time = `${hours}:${date.getMinutes()} ${meredian}`;
    const getOrdinalSuffix = (day) => {
        if (day > 3 && day < 21) return "th";
        switch (day % 10) {
            case 1:
                return "st";
            case 2:
                return "nd";
            case 3:
                return "rd";
            default:
                return "th";
        }
    };
    return `${time} ${day}${getOrdinalSuffix(day)} ${month}, ${year}`;
};

function ChatHeader() {
    const { selectedUser, setSelectedUser } = useChatStore();
    const { onlineUsers } = useAuthStore();

    return (
        <div className="p-2.5 border-b border-gray-300 w-full">
            <div className="flex justify-between items-center w-full">
                <div className="flex items-center gap-3 w-full">
                    {/* Avatar */}
                    <div className="avatar">
                        <div className="size-12 rounded-full relative">
                            <img
                                src={
                                    selectedUser?.profilepic ||
                                    "https://api.iconify.design/material-symbols:account-circle.svg?color=%23888888"
                                }
                                alt={selectedUser?.fullname}
                                className="w-full object-cover rounded-full aspect-square p-1 ring-2 ring-indigo-800"
                            />
                        </div>
                    </div>
                    {/* Users */}
                    <div>
                        <h3 className="font-medium">
                            {selectedUser?.fullname}
                        </h3>
                        <p className="text-sm text-gray-700">
                            {onlineUsers.includes(selectedUser._id)
                                ? "Online"
                                : "Offline"}
                        </p>
                    </div>
                    {/* Close Button */}
                    <Button
                        minimal={true}
                        icon="cross"
                        className="ml-auto"
                        onClick={() => setSelectedUser(null)}
                    ></Button>
                </div>
            </div>
        </div>
    );
}
function MessageInput({ addToast }) {
    const [text, setText] = useState("");
    const [imgPrev, setImgPrev] = useState(null);
    const fileInputRef = useRef(null);
    const { sendMessage, isSendingMessage } = useChatStore();

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!text.trim() && !imgPrev) return;

        try {
            await sendMessage({
                content: text,
                image: imgPrev,
            });
            setText("");
            setImgPrev(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
        } catch (error) {
            console.log("Error sending message", error);
        }
    };
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file?.type.startsWith("image/")) {
            addToast("Please select an image file", "danger");
            return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
            setImgPrev(reader.result);
        };
        reader.readAsDataURL(file);
    };
    const removeImage = () => {
        setImgPrev(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    return (
        <div className="p-4 w-full">
            {imgPrev && (
                <div className="mb-3 flex items-center gap-2">
                    <div className="relative">
                        <img
                            src={imgPrev}
                            alt="Preview"
                            className="w-20 h-20 object-cover rounded-lg border borde-indigo-700"
                        />
                        <Button
                            onClick={removeImage}
                            className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-gray-300 grid place-items-center"
                            type="button"
                            icon="cross"
                        />
                    </div>
                </div>
            )}
            <form
                onSubmit={handleSendMessage}
                className="flex items-center gap-2"
            >
                <div className="flex-1 flex gap-2">
                    <InputGroup
                        onChange={(e) => setText(e.target.value)}
                        // round={true}
                        type="text"
                        value={text}
                        required
                        fill={true}
                        placeholder="Type your Message..."
                    />
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                    />
                    <Button
                        type="button"
                        className="hidden sm:flex aspect-square rounded-full"
                        intent={imgPrev ? "success" : "secondary"}
                        onClick={() => fileInputRef.current?.click()}
                        icon="media"
                    />
                    <Button
                        type="submit"
                        icon="send-message"
                        className="rounded-full aspect-square"
                        disabled={
                            (!text.trim() && !imgPrev) || isSendingMessage
                        }
                        intent="primary"
                        minimal={true}
                        onClick={handleSendMessage}
                    />
                </div>
            </form>
        </div>
    );
}

function ChatContainer({ addToast }) {
    const {
        selectedUser,
        messages,
        getMessages,
        isMessagesLoading,
        subToMessage,
        unSubToMessage,
    } = useChatStore();
    const messageEndRef = useRef(null);

    useEffect(() => {
        getMessages(selectedUser._id, addToast);
        subToMessage();
        return () => unSubToMessage();
    }, [getMessages, selectedUser._id, addToast, subToMessage, unSubToMessage]);

    useEffect(() => {
        if (messageEndRef.current && messages) {
            messageEndRef.current?.scrollIntoView({ behaviour: "smooth" });
        }
    }, [messages]);

    return (
        <div
            className={`w-full flex-1 flex flex-col overflow-auto ${
                isMessagesLoading ? " bp5-skeleton" : ""
            }`}
        >
            <ChatHeader />
            <div
                className={`${
                    isMessagesLoading ? "bp5-skeleton" : ""
                } flex-1 overflow-y-auto p-4 space-y-4 `}
            >
                {messages.length === 0 && (
                    <NoChat
                        content={`You have no chat with ${selectedUser.fullname}`}
                    />
                )}
                {messages.map((message) => {
                    return (
                        <div
                            key={message._id}
                            className={`
                        ${
                            message.senderId === selectedUser._id
                                ? "justify-start justify-items-start"
                                : "justify-end justify-items-end"
                        }
                        w-full grid items-center
                        `}
                            ref={messageEndRef}
                        >
                            <span
                                className={`
                        ${
                            message.senderId === selectedUser._id
                                ? "bg-gray-300 items-start"
                                : "bg-indigo-300 items-end"
                        } p-2 rounded-lg text-sm flex flex-col justify-center
                        `}
                            >
                                {message.image && (
                                    <img
                                        src={message.image}
                                        alt="Preview"
                                        className="w-20 h-20 object-cover rounded-lg border borde-indigo-700"
                                    />
                                )}
                                {message.content}
                            </span>

                            <span className="text-xs">
                                {formatMongoDate(message.createdAt)}
                            </span>
                        </div>
                    );
                })}
            </div>
            <MessageInput addToast={addToast} />
        </div>
    );
}
ChatContainer.propTypes = {
    addToast: PropTypes.func.isRequired,
};
MessageInput.propTypes = {
    addToast: PropTypes.func.isRequired,
};
export default ChatContainer;
