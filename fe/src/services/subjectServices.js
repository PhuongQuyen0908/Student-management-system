import axios from "../setup/axios";

const createSubject = (data) => {
    return axios.post("/api/subject/create", data);
}

const fetchAllSubject = () => {
    return axios.get(
        '/api/subject/read'
    );
};

const deleteSubject = (subject) => {
    return axios.delete(`/api/subject/delete/${subject.MaMonHoc}`, {
        data: { MaMonHoc: subject.MaMonHoc },
    });
};


const updateCurrentSubject = (subjectData) => {
    return axios.put(`/api/subject/yearupdate/${subjectData.MaMonHoc}`, { ...subjectData });
}

export { createSubject, deleteSubject, fetchAllSubject, updateCurrentSubject };
