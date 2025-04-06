import { useState } from 'react';
import { toast } from 'react-toastify';

const useLogin = () => {
    const [valueLogin, setValueLogin] = useState("");
    const [password, setPassword] = useState("");
    const [objValidInput, setObjValidInput] = useState({
        isValidValueLogin: true,
        isValidPassword: true
    });

    const handleLogin = () => {
        if (!valueLogin) {
            setObjValidInput({ ...objValidInput, isValidValueLogin: false });
            toast.error("Please enter your email address or phone number");
            return;
        }
        if (!password) {
            setObjValidInput({ ...objValidInput, isValidPassword: false });
            toast.error("Please enter your password");
            return;
        }

        console.log("Login successful!");
    };

    const handlePressEnter = (event) => {
        if (event.key === "Enter") {
            handleLogin();
        }
    };

    return {
        valueLogin,
        password,
        objValidInput,
        setValueLogin,
        setPassword,
        handleLogin,
        handlePressEnter
    };
};

export default useLogin;
