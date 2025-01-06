import {
    Navbar,
    Button,
    OverlayToaster,
    Position,
    Toast2,
    Popover,
    Menu,
    MenuItem,
    MenuDivider,
} from "@blueprintjs/core";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import logo from "../../assets/logo.png";

function Nav({ toasts, toaster, addToast }) {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout(addToast);
    };

    return (
        <Navbar
            className="flex h-16 justify-between items-center bg-indigo-300"
            // fixedToTop={true}
        >
            <Navbar.Heading
                onClick={() => navigate("/")}
                className="cursor-pointer mr-auto font-semibold flex justify-center items-center"
            >
                <img src={logo} alt="RChats-logo" className="size-12 " />
                <span className="text-2xl">
                    <span className="text-indigo-800">R</span>Chats
                </span>
            </Navbar.Heading>
            {user ? (
                <>
                    <Popover
                        placement="bottom"
                        content={
                            <Menu>
                                <MenuItem
                                    icon="cog"
                                    text="Profile"
                                    onClick={() => navigate("/profile")}
                                />
                                <MenuDivider />
                                <MenuItem
                                    icon="log-out"
                                    text="Logout"
                                    onClick={() => handleLogout()}
                                />
                            </Menu>
                        }
                    >
                        <Button
                            alignText="left"
                            icon="applications"
                            className="rounded-lg"
                            rightIcon="caret-down"
                            text={user.fullname}
                        />
                    </Popover>
                    <img
                        src={
                            user.profilepic ||
                            "https://api.iconify.design/material-symbols:account-circle.svg?color=%23888888"
                        }
                        alt="Profile Picture"
                        className="h-4/5 ml-2 bg-white aspect-square rounded-full object-cover p-1 "
                    />
                </>
            ) : (
                <>
                    <Button
                        alignText="left"
                        icon="applications"
                        text="Signup"
                        intent="secondary"
                        minimal={true}
                        onClick={() => navigate("/signup")}
                        className="mx-2"
                    />
                    <Button
                        alignText="left"
                        icon="applications"
                        text="Login"
                        intent="secondary"
                        minimal={true}
                        onClick={() => navigate("/login")}
                        className="mx-2"
                    />
                </>
            )}
            <OverlayToaster position={Position.TOP} ref={toaster} maxToasts={5}>
                {toasts.map((toast) => (
                    <Toast2 key={toast.key} {...toast} minimal={true} />
                ))}
            </OverlayToaster>
        </Navbar>
    );
}
Nav.propTypes = {
    toasts: PropTypes.arrayOf(
        PropTypes.shape({
            key: PropTypes.string.isRequired,
            message: PropTypes.string.isRequired,
            intent: PropTypes.string,
            timeout: PropTypes.number,
        })
    ).isRequired,
    toaster: PropTypes.object.isRequired,
    addToast: PropTypes.func.isRequired,
};

export default Nav;
