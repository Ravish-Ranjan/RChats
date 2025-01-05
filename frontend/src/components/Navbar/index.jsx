import {
    Navbar,
    Button,
    OverlayToaster,
    Position,
    Toast2,
} from "@blueprintjs/core";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";

function Nav({ toasts, toaster,addToast }) {
    const { user,logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout(addToast);
    }

    return (
        <Navbar className="h-15">
            <Navbar.Group>
                <Navbar.Heading>RChats</Navbar.Heading>
                <Navbar.Divider />
                <Button
                    className="bp5-minimal"
                    icon="home"
                    text="Home"
                    onClick={() => navigate("/")}
                />
                {user ? (
                    <Button
                        className="bp5-minimal"
                        icon="log-out"
                        text="Logout"
                        onClick={handleLogout}
                    />
                ) : (
                    <>
                        <Button
                            className="bp5-minimal"
                            icon="new-person"
                            text="Signup"
                            onClick={() => navigate("/signup")}
                        />
                        <Button
                            className="bp5-minimal"
                            icon="log-in"
                            text="Login"
                            onClick={() => navigate("/login")}
                        />
                    </>
                )}
            </Navbar.Group>
            <OverlayToaster
                position={Position.TOP_RIGHT}
                ref={toaster}
                maxToasts={5}
            >
                {toasts.map((toast) => (
                    <Toast2 key={toast.key} {...toast} />
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
