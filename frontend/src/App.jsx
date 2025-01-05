import { Navigate, Route, Routes } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore.js";
import { useEffect } from "react";
import { Icon, IconSize } from "@blueprintjs/core";
import { useRef, useState } from "react";

import Navbar from "./components/Navbar/index.jsx";
import Home from "./components/Home/index.jsx";
import Login from "./components/Login/index.jsx";
import Profile from "./components/Profile/index.jsx";
import Signup from "./components/Signup/index.jsx";

function App() {
    const { user, checkAuth, isCheckingAuth } = useAuthStore();
    const [toasts] = useState([]);
    const toaster = useRef(null);

    const addToast = (message, intent) => {
        toaster.current?.show({
            key: message,
            message,
            intent,
        });
    };

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);
    if (isCheckingAuth && !user) {
        return (
            <div className="grid place-items-center h-dvh">
                <Icon icon="refresh" size={IconSize.LARGE} intent="$indigo1" />;
            </div>
        );
    }
    return (
        <div className="h-dvh flex flex-col">
            <Navbar toasts={toasts} toaster={toaster} addToast={addToast} />
            <Routes>
                <Route
                    path="/"
                    index
                    element={
                        user ? (
                            <Home addToast={addToast} />
                        ) : (
                            <Navigate to="/login" />
                        )
                    }
                />
                <Route
                    path="/signup"
                    element={
                        !user ? (
                            <Signup addToast={addToast} />
                        ) : (
                            <Navigate to="/" />
                        )
                    }
                />
                <Route
                    path="/login"
                    element={
                        !user ? (
                            <Login addToast={addToast} />
                        ) : (
                            <Navigate to="/" />
                        )
                    }
                />
                <Route
                    path="/profile"
                    element={
                        user ? (
                            <Profile addToast={addToast} />
                        ) : (
                            <Navigate to="/login" />
                        )
                    }
                />
            </Routes>
        </div>
    );
}

export default App;
