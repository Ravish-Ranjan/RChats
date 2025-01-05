import { useEffect } from "react";
import { useChatStore } from "../../store/useChatStore";
import { useAuthStore } from "../../store/useAuthStore";
import { User } from "@blueprintjs/icons";
import { Button } from "@blueprintjs/core";
import PropTypes from "prop-types";

function Sidebar({ addToast }) {
    const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } =
        useChatStore();
    const { onlineUsers } = useAuthStore();
    useEffect(() => {
        getUsers(addToast);
    }, [getUsers,addToast]);

    useEffect(() => {}, [selectedUser]);

    return (
        <aside
            className={`${
                isUsersLoading ? "bp5-skeleton" : ""
            } h-full w-20 lg:w-72 border-r border-gray-200 flex flex-col transition-all duration-200`}
        >
            <div className="border-b border-gray-300 w-full p-5">
                <div className="flex items-center gap-3">
                    <User className="" size={30} color="#5F6B7C" />
                    <span className="text-xl font-medium hidden lg:block">
                        Contacts
                    </span>
                </div>
                {/* Online filter */}
            </div>
            <div className="overflow-y-auto py-3">
                {users.map((user) => {
                    return (
                        <Button
                            key={user._id}
                            onClick={() => setSelectedUser(user)}
                            className={`flex justify-start items-center gap-3 p-3 hover:bg-gray-400 transition-colors button-text-full
                            ${
                                selectedUser?._id === user._id
                                    ? " bg-gray-300 ring-2 ring-indigo-600"
                                    : ""
                            }
                            `}
                            fill={true}
                            outlined={true}
                        >
                            <div className="relative mx-auto lg:mx-0">
                                <img
                                    src={
                                        user.profilepic ||
                                        "https://api.iconify.design/material-symbols:account-circle.svg?color=%23888888"
                                    }
                                    alt="Profile Pic"
                                    className="size-12 object-cover rounded-full"
                                />
                                {onlineUsers.includes(user._id) && (
                                    <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-600"></span>
                                )}
                            </div>
                            <div className="hidden lg:block text-left min-w-0">
                                <div className="font-medium truncate">
                                    {user.fullname}
                                </div>
                                <div className="text-sm text-zinc-600 ">
                                    {onlineUsers.includes(user._id)
                                        ? "Online"
                                        : "Offline"}
                                </div>
                            </div>
                        </Button>
                    );
                })}
            </div>
        </aside>
    );
}
Sidebar.propTypes = {
    addToast: PropTypes.func.isRequired,
};
export default Sidebar;
