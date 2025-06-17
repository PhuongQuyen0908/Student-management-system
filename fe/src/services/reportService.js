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

  getSemesterReport: ({
  tenHocKy,
  tenNamHoc,
  searchTerm = '',
  searchField = 'all',
  sortBy = null,
  order = 'asc'
}) =>
  axios.post('/api/report/semester-report', {
    tenHocKy,
    tenNamHoc,
    searchTerm,
    searchField,  // ✅ thêm dòng này
    sortBy,
    order,
  }),




  getSubjectReport: ({
  tenMonHoc,
  tenHocKy,
  tenNamHoc,
  searchTerm = '',
  searchField = 'all',  // ✅ THÊM DÒNG NÀY
  sortBy = null,
  order = 'asc'
}) =>
  axios.post('/api/report/subject-report', {
    tenMonHoc,
    tenHocKy,
    tenNamHoc,
    searchTerm,
    searchField,         // ✅ THÊM DÒNG NÀY
    sortBy,
    order,
  }),

  getOptionsReport: () => axios.get('/api/report/options-report'),

  sortSubjectReport: ({ data, sortBy, order }) =>
     axios.post('/api/report/sort-subject-report', {
    data, sortBy, order,
  })
};
  
  
  

export default reportService;