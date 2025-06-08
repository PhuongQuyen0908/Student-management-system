import axios from "../setup/axios";

const subjectGradeService = {
  // 1. Lấy danh sách lớp, học kỳ, năm học, môn học
  getOptions: () => axios.get('/api/report/options'),

  // 2. Lấy bảng điểm theo môn học của học sinh (BM5.1 - subject summary)
  getSubjectSummary: ({ tenLop, tenHocKy, tenNamHoc, tenMonHoc }) =>
    axios.get('/api/report/subject-summary', {
      params: { tenLop, tenHocKy, tenNamHoc, tenMonHoc }
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
};
export default subjectGradeService;