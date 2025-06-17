import axios from "../setup/axios";

// Lấy tất cả loại kiểm tra không phân trang
const getAllTests = () => {
    return axios.get("/api/test/read");
};

// Tạo loại kiểm tra mới
const createTest = (data) => {
    return axios.post("/api/test/create", data);
};

// Lấy loại kiểm tra theo ID
const getTestById = (id) => {
    return axios.get(`/api/test/getByID/${id}`);
};

// Xóa loại kiểm tra
const deleteTest = (id) => {
    return axios.delete(`/api/test/delete/${id}`);
};

// Cập nhật loại kiểm tra
const updateTest = (id, testData) => {
    return axios.put(`/api/test/update/${id}`, { ...testData });
};

export {
    getAllTests,
    createTest,
    getTestById,
    deleteTest,
    updateTest,
};
