import axios from "axios";



const createStudent = (data) => {
  return axios.post("http://localhost:9000/api/v1/student/create", data);
}

const fetchAllStudent = (page, limit) => {
  return axios.get(
    `http://localhost:9000/api/v1/student/read?page=${page}&limit=${limit}`
  );
};

const deleteStudent = (student) => {
  return axios.delete(`http://localhost:9000/api/v1/student/delete`, {
    data: { maHS: student.maHS },
  });
};


const updateCurrentStudent = (studentData) => {
  return axios.put(`http://localhost:9000/api/v1/student/update`, {...studentData});
}

export { createStudent , deleteStudent, fetchAllStudent, updateCurrentStudent };
