import axios from "../setup/axios";

const createStudent = (data) => {
  return axios.post("/api/student/create", data);
}

const fetchAllStudent = (page, limit) => {
  return axios.get(
    `api/student/read?page=${page}&limit=${limit}`
  );
};

const deleteStudent = (student) => {
  return axios.delete(`/api/student/delete`, {
    data: { MaHocSinh: student.MaHocSinh },
  });
};


const updateCurrentStudent = (studentData) => {
  return axios.put(`/api/student/update`, {...studentData});
}

export { createStudent , deleteStudent, fetchAllStudent, updateCurrentStudent };
