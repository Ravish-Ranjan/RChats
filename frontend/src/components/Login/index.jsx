import { Button, FormGroup, InputGroup } from "@blueprintjs/core";
import { useState } from "react";
import AnimateBox from "../AnimateBox/index.jsx";
import PropTypes from "prop-types";
import { useAuthStore } from "../../store/useAuthStore.js";

function Login({ addToast }) {
    const [form, setForm] = useState({
        email: "",
        password: "",
    });
    const [visi, setVisi] = useState(false);
    const {login,isLoggingIn} = useAuthStore();

    const validate = () => {
        let allcorrect = true;
        if (!form.email) {
            addToast("Email field is required", "warning");
            allcorrect = false;
        }
        if (form.email && !/\S+@\S+\.\S+/.test(form.email)){
            addToast("Not a valid email", "warning");
            allcorrect = false;
        }
        if (!form.password) {
            addToast("Password field is required", "warning");
            allcorrect = false;
        }
        if (form.password && form.password.length <8){
            addToast("Password should be 8 chareacters or more", "warning");
            allcorrect = false;
        }
        return allcorrect;
    };

    const submitLogin = async (e) => {
        e.preventDefault();
        if (validate()){
            login(form,addToast)
        }
        
    };

    return (
        <div className="w-full flex justify-evenly items-center bg-indigo-300 relative" style={{height:"calc(100dvh - 4rem)"}}>
            <form
                method="post"
                className="h-5/6 bg-gray-200 mx-10 p-2 flex flex-col gap-6 rounded-xl"
                style={{ aspectRatio: "3/4" }}
            >
                <span className="text-3xl font-semibold mt-4">Login</span>
                <div className="grid">
                    <FormGroup
                        label="Email"
                        labelFor="email"
                        labelInfo="(required)"
                    >
                        <InputGroup
                            leftIcon="at"
                            onChange={(e) =>
                                setForm({ ...form, email: e.target.value })
                            }
                            // round={true}
                            type="email"
                            name="email"
                            id="email"
                            value={form.email}
                            required
                            placeholder="eg. test@gmail.com"
                        />
                    </FormGroup>
                    <FormGroup
                        label="Password"
                        labelFor="password"
                        labelInfo="(minimum length 8 chars.)"
                    >
                        <InputGroup
                            leftIcon="key"
                            onChange={(e) =>
                                setForm({ ...form, password: e.target.value })
                            }
                            // round={true}
                            type={visi ? "text" : "password"}
                            name="password"
                            value={form.password}
                            required
                            id="password"
                            placeholder="eg. ********"
                            rightElement={
                                <Button
                                    icon={visi ? "eye-open" : "eye-off"}
                                    type="button"
                                    onClick={() => setVisi(!visi)}
                                ></Button>
                            }
                        />
                    </FormGroup>
                </div>
                <div className="grid gap-2 place-items-center">
                    <Button
                        text="Login"
                        intent="primary"
                        fill={true}
                        rightIcon="log-in"
                        type="submit"
                        disabled={isLoggingIn}
                        onClick={submitLogin}
                    />
                    <a href="/signup">Don&apos;t have an Account?</a>
                </div>
            </form>
            <AnimateBox />
        </div>
    );
}
Login.propTypes = {
    addToast: PropTypes.func.isRequired,
};
export default Login;
