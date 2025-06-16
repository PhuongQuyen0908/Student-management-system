  import classAPIService from "../service/classAPIService"; // Đảm bảo import đúng service
  import db from '../models/index.js';
  // Chức năng read
const readClass = async (req, res) => {
  try{
    let page = req.query.page ? parseInt(req.query.page) : 1; // Trang hiện tại, mặc định là 1
    let limit = req.query.limit ? parseInt(req.query.limit) : 7; // Số lượng lớp học trên mỗi trang, mặc định là 7
    let sortField = req.query.sortField || 'MaLop'; // Trường sắp xếp, mặc định là MaLop
    let sortOrder = req.query.sortOrder || 'asc'; // Thứ tự sắp xếp, mặc định là 'asc'
    let search = req.query.search || ''; // Từ khóa tìm kiếm, mặc định là rỗng
    let data;
    if (search) {
      // Nếu có từ khóa tìm kiếm, gọi service để tìm kiếm theo từ khóa
      data = await classAPIService.getAllClassesWithSearch(search, page, limit, sortField, sortOrder);
    } else if (req.query.page && req.query.limit) {
      // Không có search nhưng có phân trang, gọi service để lấy danh sách lớp học với phân trang
      data = await classAPIService.getClassWithPagination(page, limit, sortField, sortOrder);
    } else {
      // Không có search và không có phân trang, gọi service để lấy tất cả lớp học
      data = await classAPIService.getAllClasses();
    }
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT
    });
  }catch (error) {
    console.error(error);
    return res.status(500).json({
      EM: 'Lỗi phía server',
      EC: -1, // Mã lỗi
      DT: [] // Dữ liệu trả về
    });
}}


  // Lấy lớp học theo ID
  const getClassById = async (req, res) => {
    try {
      const id = req.params.id;
      const result = await classAPIService.getClassById(id);
      if (result) {
        return res.status(200).json({
          EM: 'Lấy lớp học thành công',
          EC: 0,
          DT: result
        });
      } else {
        // 404 Not Found: ID không tồn tại
        return res.status(404).json({
          EM: 'Lớp học không tồn tại',
          EC: 1,
          DT: []
        });
      }
    } catch (error) {
      return res.status(500).json({
        // 404 Not Found: ID không tồn tại
        EM: error.message,
        EC: -1,
        DT: []
      });
    }
  };

  // Chức năng create
  const createClass = async (req, res) => {
    try {
      // Kiểm tra xem lớp đã tồn tại chưa
      // Giá trị của existingClass là kiểu boolean
      let existingClass = await classAPIService.checkClassExists(req.body.className);
      if (existingClass){
        //Lớp học đã tồn tại
        console.log("Check existingClass", existingClass);
        return res.status(409).json({
          // 409 Conflict: Lớp học đã tồn tại
          EM: 'Lớp học đã tồn tại',
          EC: 1,
          DT: ""
        });
      };
      // Nếu lớp chưa tồn tại, gọi service để tạo lớp mới
      let data = await classAPIService.createClass(req.body);
      return res.status(200).json({
        EM: 'Tạo lớp học thành công',
        EC: 0,
        DT: data
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ 
        EM: 'Lỗi phía server',
        EC: -1,
        DT: ""
      });
    }
  };


  // Hàm xử lý cập nhật lớp học
  const updateClass = async (req, res) => {
    try {
      let  id = req.params.id;
      // Kiểm tra xem lớp học có tồn tại không
      let isExisted = await classAPIService.checkClassExists(req.body.className);
      if (isExisted) {
        // 409 Conflict: Lớp học đã tồn tại
        return res.status(409).json({
          EM: "Lớp học đã tồn tại. Bạn không thể cập nhật lớp học với tên này.",
          EC: 1,
          DT: ""
        });
      }
      // Nếu lớp học chưa tồn tại, gọi service để cập nhật lớp học
      let data = await classAPIService.updateClass(id, req.body);
      return res.status(200).json(data);
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        EM: "Lỗi phía server",
        EC: -1,
        DT: ""
      });
    }
  };

  // Hàm xử lý xóa lớp học
  const deleteClass = async (req, res) => {
    try {
      let id = req.params.id;
      // Kiểm tra xem lớp học có tồn tại không
      let isExisted = await classAPIService.getClassById(id);
      if (!isExisted) {
        // 404 Not Found: Lớp học không tồn tại
        return res.status(404).json({
          EM: "Lớp học không tồn tại",
          EC: 1,
          DT: []
        });
      }
      // Nếu lớp học tồn tại, gọi service để xóa lớp học
      let data = await classAPIService.deleteClass(id); 
      return res.status(200).json(data); 
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        EM: "Lỗi phía server",
        EC: -1,
        DT: []
      });
    }
  };


  // Export các hàm
  module.exports = {
    readClass,
    getClassById,
    createClass,
    updateClass,
    deleteClass
  };
