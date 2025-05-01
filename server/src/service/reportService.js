// src/services/reportService.js
import axios from 'axios';

// Lấy các tùy chọn (lớp học, học kỳ, năm học, môn học) từ backend
const getOptions = () => {
  return axios.get('/api/report/options'); // Gọi API để lấy dữ liệu
};

// Lấy báo cáo tổng kết môn học
const getSubjectSummary = (lopId, hocKyId, namHocId, monHocId) => {
  const params = {
    lopId,
    hocKyId,
    namHocId,
    monHocId,
  };
  return axios.get('/api/report/subject-summary', { params });
};

const reportService = {
  getOptions,
  getSubjectSummary,
};

export default reportService;
