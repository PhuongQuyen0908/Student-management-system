import axios from "../setup/axios";

const fetchStudentWithYear = (year , page ,limit , search ="") =>{
  return axios.get('api/student/read', {
    params: {
      year,
      search,
      page,
      limit,
    },
  });
} 

const featchAllYear = () => {
  return axios.get("/api/year/read");
}


const createStudent = (data) => {
  return axios.post("/api/student/create", data);
}

// const fetchAllStudent = (page, limit , search="") => {
//   return axios.get(
//     `api/student/read?search=${search}&page=${page}&limit=${limit}`
//   );
// };

//sửa lại đoạn fetchAllStudent để có thể search 
const fetchAllStudent = (page, limit, search = "") => {
  return axios.get('api/student/read', {
    params: {
      search,
      page,
      limit,
    },
  });
};

const deleteStudent = (student) => {
  return axios.delete(`/api/student/delete`, {
    data: { MaHocSinh: student.MaHocSinh },
  });
};


const updateCurrentStudent = (studentData) => {
  return axios.put(`/api/student/update`, {...studentData});
}

export { createStudent , deleteStudent, fetchAllStudent, updateCurrentStudent,featchAllYear,fetchStudentWithYear };
