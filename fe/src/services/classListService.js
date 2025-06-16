import axios from '../setup/axios';

// Get all class lists
const getAllClassLists = () => {
  return axios.get('/api/classList/read');
};

// Get class list by ID
const getClassListById = (id) => {
  return axios.get(`/api/classList/getById/${id}`);
};

// Get class list by class name and year
const getClassListByNameAndYear = (tenLop, namHoc) => {
  console.log(`Making API request to /api/classList/filter?tenLop=${tenLop}&namHoc=${namHoc}`);
  return axios.get(`/api/classList/filter?tenLop=${tenLop}&namHoc=${namHoc}`);
};

// Create a new class list
const createClassList = (data) => {
  return axios.post('/api/classList/create', data);
};

// Update a class list
const updateClassList = (id, data) => {
  return axios.put(`/api/classList/update/${id}`, data);
};

// Delete a class list
const deleteClassList = (id) => {
  return axios.delete(`/api/classList/delete/${id}`);
};

// Add a student to a class
const addStudentToClass = (data) => {
  return axios.post('/api/classList/addStudent', data);
};

// Remove a student from a class
const removeStudentFromClass = (id) => {
  return axios.delete(`/api/classList/removeStudent/${id}`);
};

const getStudentsOfClass = (classId, options = {}) => {
  // classId ở đây tương ứng với :id trong route
  // options là một object { page, limit, search, sortField, sortOrder }
  if (!classId) {
    return Promise.reject(new Error("Class ID is required"));
  }
  // URL này khớp với route đã sửa: /classList/getStudentInClass/:id
  return axios.get(`/api/classList/getStudentInClass/${classId}`, {
    params: options
  });
};
export {
  getAllClassLists,
  getClassListById,
  getClassListByNameAndYear,
  createClassList,
  updateClassList,
  deleteClassList,
  addStudentToClass,
  removeStudentFromClass, 
  getStudentsOfClass
};