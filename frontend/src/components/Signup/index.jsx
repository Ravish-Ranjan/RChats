import { Button, FormGroup, InputGroup } from "@blueprintjs/core";
import { useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import AnimateBox from "../AnimateBox/index.jsx"
import PropTypes from "prop-types";

function Signup({addToast}) {
    const [form, setForm] = useState({
        fullname: "",
        email: "",
        password: "",
    });
    const [visi, setVisi] = useState(false);
    const {signup,isSigningUp} = useAuthStore();

    const validate = () => {
        let allcorrect = true;
        if (!form.fullname){
            addToast("Full Name is required", "warning");
            allcorrect = false;
        }
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validate()){
            signup(form,addToast)
        }
        
    };

    return (
        <div className="h-full w-full flex justify-evenly items-center bg-indigo-300">
            <form
                method="post"
                className="h-5/6 bg-gray-200 mx-10 p-2 flex flex-col gap-6 rounded-xl"
                style={{ aspectRatio: "3/4" }}
            >
                <span className="text-3xl mt-4 font-semibold">Register</span>
                <div className="grid">
                    <FormGroup
                        label="Full Name"
                        labelFor="fullname"
                        labelInfo="(required)"
                    >
                        <InputGroup
                            leftIcon="user"
                            onChange={(e) =>
                                setForm({ ...form, fullname: e.target.value })
                            }
                            // round={true}
                            type="text"
                            name="text"
                            id="fullname"
                            value={form.fullname}
                            required
                            placeholder="eg. John Doe"
                        />
                    </FormGroup>
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
                        labelInfo="(required)"
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
                        text="Register"
                        intent="primary"
                        fill={true}
                        rightIcon="log-in"
                        type="submit"
                        disabled={isSigningUp}
                        onClick={handleSubmit}
                    />
                    <a href="/login">Already have an Account?</a>
                </div>
            </form>
            <AnimateBox />
        </div>
    );
}
Signup.propTypes = {
    addToast: PropTypes.func.isRequired,
};
export default Signup;
