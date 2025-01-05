import PropTypes from "prop-types";
import { useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { Camera, User, At } from "@blueprintjs/icons";

const formatMongoDate = (mongoDateString) => {
    const date = new Date(mongoDateString);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();
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
    return `${day}${getOrdinalSuffix(day)} ${month}, ${year}`;
};

function Profile({ addToast }) {
    const { user, isChangingPic, changepic } = useAuthStore();
    const [selectedImg, setSelectedImg] = useState(null);

    const handleSubmit = async (e) => {
        const file = e.target.files[0];
        console.log(file);
        if (!file) return;
        const reader = new FileReader();
        reader.readAsDataURL(file);
        console.log(reader);
        reader.onload = async () => {
            const base64Img = reader.result;
            setSelectedImg(base64Img);
            await changepic({ profilepic: base64Img }, addToast);
        };
    };
    return (
        <div
            className="bg-indigo-300 p-4 bg-gradient-to-br from-indigo-300 to-indigo-500 flex flex-col justify-start items-start gap-2 px-6"
            style={{ minHeight: "90vh" }}
        >
            <div className="max-w-3xl mx-auto p-2 py-4">
                <div className="bg-gray-300 rounded-xl p-6 space-y-8">
                    <div className="text-center">
                        <h1 className="text-3xl font-semibold">Profile</h1>
                        <p className="mt-2">Your Profile Information</p>
                    </div>
                    <div className="flex flex-col items-center gap-4">
                        <div className="relative outline-4 -outline-offset-4 outline-black">
                            <img
                                src={
                                    selectedImg ||
                                    user.profilepic ||
                                    "https://api.iconify.design/material-symbols:account-circle.svg?color=%23888888"
                                }
                                alt="ProfilePic"
                                className="size-36 rounded-full object-cover p-1 bg-indigo-400 border-4 border-black"
                            />
                            <label
                                htmlFor="avatar-upload"
                                className={`absolute bottom-0 right-0 bg-white hover:scale-105 p-2 rounded-full cursor-pointer transition-all duration-200 ${
                                    isChangingPic
                                        ? "animate-pulse pointer-events-none"
                                        : ""
                                }`}
                            >
                                <Camera className="w-5 h-5 text-black-200 grid place-items-center shadow-xl" />
                                <input
                                    type="file"
                                    name=""
                                    id="avatar-upload"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleSubmit}
                                    disabled={isChangingPic}
                                />
                            </label>
                        </div>
                        <p className="text-sm text-zinc-600">
                            {isChangingPic
                                ? "Uploading..."
                                : "Click the camera icon to change your profile picture"}
                        </p>
                    </div>
                    <div className="space-y-6">
                        <div className="space-y-1.5">
                            <div className="text-sm text-zinc-600 flex items-center gap-2">
                                <User /> Full Name
                            </div>
                            <p className="px-4 py-2.5 bg-gray-200 rounded-lg border">
                                {user?.fullname}
                            </p>
                        </div>
                        <div className="space-y-1.5">
                            <div className="text-sm text-zinc-600 flex items-center gap-2">
                                <At /> Email Address
                            </div>
                            <p className="px-4 py-2.5 bg-gray-200 rounded-lg border">
                                {user?.email}
                            </p>
                        </div>
                    </div>
                    <div className="mt-6 bg-gray-200 rounded-xl p-6">
                        <h2 className="text-lg font-medium mb-4">
                            Account Information
                        </h2>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between items-center py-2 border-b border-zinc-300">
                                <span>Member Since</span>
                                <span>{formatMongoDate(user?.createdAt)}</span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                                <span>Account Status</span>
                                <span className="text-green-700 font-semibold">
                                    Active
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

Profile.propTypes = {
    addToast: PropTypes.func.isRequired,
};
export default Profile;
