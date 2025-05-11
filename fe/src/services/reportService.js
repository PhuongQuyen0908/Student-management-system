import axios from "../setup/axios";

const reportService = {
  // 1. Lấy danh sách lớp, học kỳ, năm học, môn học
  getOptions: () => axios.get('/api/report/options'),

  // 2. Lấy bảng điểm theo môn học của học sinh (BM5.1 - subject summary)
  getSubjectSummary: ({ tenLop, tenHocKy, tenNamHoc, tenMonHoc }) =>
    axios.get('/api/report/subject-summary', {
      params: { tenLop, tenHocKy, tenNamHoc, tenMonHoc }
    }),

  // 3. Thêm điểm kiểm tra cho học sinh
  addScore: ({ HoTen, TenLop, TenMonHoc, TenHocKy, TenNamHoc, DiemTP }) =>
    axios.post('/api/report/add-score', { HoTen, TenLop, TenMonHoc, TenHocKy, TenNamHoc, DiemTP }),

  // 4. Xoá điểm kiểm tra
  deleteScore: ({ HoTen, TenLop, TenMonHoc, TenHocKy, TenNamHoc, DiemTP }) =>
    axios.post('/api/report/delete-score', { HoTen, TenLop, TenMonHoc, TenHocKy, TenNamHoc, DiemTP }),

  // 5. Chỉnh sửa điểm kiểm tra
  editScore: ({ HoTen, TenLop, TenMonHoc, TenHocKy, TenNamHoc, DiemTP }) =>
    axios.post('/api/report/edit-score', { HoTen, TenLop, TenMonHoc, TenHocKy, TenNamHoc, DiemTP }),

  // 6. Tính báo cáo tổng kết học kỳ (BM5.2)
  getSemesterReport: ({ tenHocKy, tenNamHoc }) =>
    axios.post('/api/report/semester-report', { tenHocKy, tenNamHoc }),

  // 7. Tính báo cáo tổng kết môn học (BM5.1)
  getSubjectReport: ({ tenMonHoc, tenHocKy, tenNamHoc }) =>
    axios.post('/api/report/subject-report', { tenMonHoc, tenHocKy, tenNamHoc })
};

export default reportService;
