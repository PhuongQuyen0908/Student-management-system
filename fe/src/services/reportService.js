// src/services/reportService.js
import axios from 'axios';

// Địa chỉ baseURL của backend
const BASE_URL = 'http://localhost:8083';

// Lấy danh sách options (tên lớp, năm học, học kỳ, môn học)
const getOptions = () => {
  return axios.get(`${BASE_URL}/api/report/options`);
};

const getSubjectSummary = (formValues) => {
    return axios.get('http://localhost:8083/api/report/subject-summary', {
      params: {
        tenLop: formValues.lopId,
        tenHocKy: formValues.hocKyId,
        tenNamHoc: formValues.namHocId,
        tenMonHoc: formValues.monHocId,
      }
    });
  };

// Export service
const reportService = {
  getOptions,
  getSubjectSummary,
};

export default reportService;
