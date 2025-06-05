import axios from "../setup/axios";

const loginUser = (valueLogin, password) => {
  return axios.post("/api/login", {
    valueLogin,
    password,
  },{
    withCredentials: true,
  });
};

const getUserAccount = () =>{
  return axios.get('api/account');
}

const logoutUser = () =>{
  return axios.post("/api/logout")
}

export { loginUser , getUserAccount , logoutUser};