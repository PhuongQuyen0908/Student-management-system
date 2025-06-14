import axios from "../setup/axios";

const subjectGradeService = {
  // 1. Lấy danh sách lớp, học kỳ, năm học, môn học
  getOptions: () => axios.get('/api/report/options'),

  // 2. Lấy bảng điểm theo môn học của học sinh (BM5.1 - subject summary)
  getSubjectSummary: (params) =>
    // params là object chứa: tenLop, tenHocKy, tenNamHoc, tenMonHoc, page, limit, search, sortField, sortOrder
    axios.get('/api/report/subject-summary', {
      params:params,
    }), 

  // 3. Thêm điểm kiểm tra cho học sinh
  addScore: ({ MaHocSinh, TenLop, TenMonHoc, TenHocKy, TenNamHoc, DiemTP }) =>
    axios.post('/api/report/add-score', { MaHocSinh, TenLop, TenMonHoc, TenHocKy, TenNamHoc, DiemTP }),

  // 4. Xoá điểm kiểm tra
  deleteScore: ({ MaHocSinh, TenLop, TenMonHoc, TenHocKy, TenNamHoc, DiemTP }) =>
    axios.post('/api/report/delete-score', { MaHocSinh, TenLop, TenMonHoc, TenHocKy, TenNamHoc, DiemTP }),

  // 5. Chỉnh sửa điểm kiểm tra
  editScore: ({ MaHocSinh, TenLop, TenMonHoc, TenHocKy, TenNamHoc, DiemTP }) =>
    axios.post('/api/report/edit-score', { MaHocSinh, TenLop, TenMonHoc, TenHocKy, TenNamHoc, DiemTP }),

  // 6. Lấy danh sách loại kiểm tra
  getTests: () => axios.get("/api/test/read"),

  // 7. Tạo loại kiểm tra mới
  createTestType: (data) => axios.post('/api/test/create', data),
};
export default subjectGradeService;