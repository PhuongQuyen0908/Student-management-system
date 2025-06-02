import axios from "../setup/axios";

// const fetchAllClasses = (page, limit) => {
//   if(Number.isInteger(page) && Number.isInteger(limit)){
//     return axios.get(`/api/class/read?page=${page}&limit=${limit}`);
//   }
//   else{
//     return axios.get(`/api/class/read`);
//   }
// };

const fetchAllClasses = ({ search = "", page = 1, limit = 10, sortField = "MaLop", sortOrder = "asc" }) => {
  const query = new URLSearchParams({
    search,
    page,
    limit,
    sortField,
    sortOrder,
  }).toString();

  return axios.get(`/api/class/read?${query}`);
}

const createClass = (data) => {
  return axios.post("/api/class/create",data);
}

// Get class by ID
const getClassById = (id) => {
  return axios.get(`/api/class/getById/${id}`);
};

//Delete class by ID
const deleteClass = (id) => {
  return axios.delete(`/api/class/delete/${id}`);
};

const updateCurrentClass = (id,classData) => {
  return axios.put(`/api/class/update/${id}`, {...classData});
}

const fetchAllGrades = () => {
  return axios.get("/api/classGrade/read");
}

export { 
    createClass, 
    fetchAllClasses,
    getClassById, 
    deleteClass,
    updateCurrentClass,
    fetchAllGrades
 };
