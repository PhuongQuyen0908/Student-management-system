import axios from "../setup/axios";

// Lấy danh sách tất cả khối (grades) với các tùy chọn lọc và phân trang
const fetchAllGrades = ({ search = "", page = 1, limit = 10, sortField = "TenKhoi", sortOrder = "asc" } = {}) => {
    const query = new URLSearchParams({
        search,
        page,
        limit,
        sortField,
        sortOrder,
    }).toString();

    return axios.get(`/api/classGrade/read?${query}`);
};

// Lấy tất cả khối không phân trang (dùng cho dropdown, select,...)
const getAllGrades = () => {
    return axios.get("/api/classGrade/read");
};

// Tạo mới một khối lớp
const createGrade = (data) => {
    return axios.post("/api/classGrade/create", data);
};

// Cập nhật khối lớp
const updateGrade = (id, gradeData) => {
    return axios.put(`/api/classGrade/update/${id}`, { ...gradeData });
};

// Xoá khối lớp
const deleteGrade = (id) => {
    return axios.delete(`/api/classGrade/delete/${id}`);
};

export {
    fetchAllGrades,
    getAllGrades,
    createGrade,
    updateGrade,
    deleteGrade
};
