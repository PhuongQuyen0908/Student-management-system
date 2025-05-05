// src/services/reportService.js
import axios from 'axios';

// Địa chỉ baseURL của backend
const BASE_URL = 'http://localhost:8083';

// Lấy danh sách options (tên lớp, năm học, học kỳ, môn học)
const getOptions = () => {
  return axios.get(`${BASE_URL}/api/report/options`);
};

const TongKetMon = {
  getOptions: () => axios.get(`http://localhost:8083/options`), // bạn phải tạo API này riêng nếu chưa có
  getMonTheoTen: ({ mon, hocky, namhoc }) =>
    axios.get(`${API_BASE}/mon-theo-ten`, {
      params: { mon, hocky, namhoc },
    }),
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

  const updateStudentScores = (data) => {
    return axios.post(`${BASE_URL}/api/report/update-student-scores`, data);
  };
  
// Export service
const reportService = {
  getOptions,
  getSubjectSummary,
  updateStudentScores, 
  TongKetMon,
};

export default reportService;