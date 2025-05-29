import { useState , useContext } from "react";
import { toast } from "react-toastify";
//đang sửa
import { loginUser } from "../services/userServices";
import {  useNavigate  } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const useLogin = () => {
  let Navigate = useNavigate(); //mới import 
  const{loginContext} = useContext(UserContext); // mới import
  const [valueLogin, setValueLogin] = useState("");
  const [password, setPassword] = useState("");
  const [objValidInput, setObjValidInput] = useState({
    isValidValueLogin: true,
    isValidPassword: true,
  });

  const handleLogin = async () => {
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

    let response = await loginUser(valueLogin, password);
    if (response.data && +response.data.EC === 0) {
      //sucess
      let groupWithRoles = response.data.DT.groupWithRoles;
      let username = response.data.DT.username;
      let token = response.data.DT.access_token;
      let data = {
        isAuthenticated: true,
        token: token,
        account: { groupWithRoles, username },
      };
      localStorage.setItem("jwt", token);
      loginContext(data); //login context 

      //Navigate("/admin"); // fix sau
      window.location.href = "/admin";
    }
    if (response && response.data && +response.EC !== 0) {
      //error
      toast.error(response.EM);
    }

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
    handlePressEnter,
  };
};

export default useLogin;
