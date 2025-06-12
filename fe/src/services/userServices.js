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

const createUser = (userData) => {
  return axios.post("/api/user/create", userData);
}

const deleteUser = (User) => {
  return axios.delete(`/api/user/delete`, {
    data: { TenDangNhap: User.TenDangNhap },
  });
};

const changePassword = (data) => {
  return axios.post(`/api/user/change-password`, data);
};

const updateUser = (userData) => {
  return axios.put(`/api/user/update`, { ...userData });
};
const fetchAllUsers = (page, limit ) => {
  return axios.get('api/user/read', {
    params: {
      page,
      limit,
    },
  });
};

const fetchGroup = ()=>{ //dùng để lấy danh sách nhóm người dùng cho người có quyền tạo user
  return axios.get('api/group/read');
}

export { loginUser , getUserAccount , logoutUser , fetchAllUsers, createUser, fetchGroup , deleteUser, updateUser,changePassword };