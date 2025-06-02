import axios from "../setup/axios";

const createSubject = (data) => {
    return axios.post("/api/subject/create", data);
}

const fetchAllSubject = ({ search = "", page = 1, limit = 10, sortField = "MaMonHoc", sortOrder = "asc" }) => {
  const query = new URLSearchParams({
    search,
    page,
    limit,
    sortField,
    sortOrder,
  }).toString();

  return axios.get(`/api/subject/read?${query}`);
};

const deleteSubject = (subject) => {
    return axios.delete(`/api/subject/delete/${subject.MaMonHoc}`, {
        data: { MaMonHoc: subject.MaMonHoc },
    });
};


const updateCurrentSubject = (subjectData) => {
    return axios.put(`/api/subject/update/${subjectData.MaMonHoc}`, { ...subjectData });
}

export { createSubject, deleteSubject, fetchAllSubject, updateCurrentSubject };
