import axios from "../setup/axios";

const fetchAllSchoolYears = (params) => {
  return axios.get('/api/year/paginated', {
    params: params
  });
};

const createSchoolYear = (data) => {
  return axios.post('/api/year/create', data);
};

const updateSchoolYear = (id, data) => {
  return axios.put(`/api/year/update/${id}`, data);
};

const deleteSchoolYear = (schoolYear) => {
  return axios.delete(`/api/year/delete/${schoolYear.MaNamHoc}`);
};

export {
  fetchAllSchoolYears,
  createSchoolYear,
  updateSchoolYear,
  deleteSchoolYear
};