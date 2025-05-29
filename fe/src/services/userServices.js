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

export { loginUser , getUserAccount};