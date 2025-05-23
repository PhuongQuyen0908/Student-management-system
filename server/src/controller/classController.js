  import classAPIService from "../service/classAPIService"; // Đảm bảo import đúng service
  import db from '../models/index.js';
  // Chức năng read
  const readClass = async (req, res) => {
    try {
      const page = parseInt(req.query.page, 10); 
      const limit = parseInt(req.query.limit, 10);
      const isPaginate = Number.isInteger(page) && Number.isInteger(limit);
      const data = isPaginate
      ? await classAPIService.getClassWithPagination(page, limit)
      : await classAPIService.getAllClasses();
      return res.status(200).json(data);
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        EM: "Lỗi phía server",
        EC: -1,
        DT: []
      });
    }
  };

  // Lấy lớp học theo ID
  const getClassById = async (req, res) => {
    try {
      const id = req.params.id;
      const result = await classAPIService.getClassById(id);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(404).json({
        EM: error.message,
        EC: 1,
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
      if (existingClass) {
        return res.status(400).json({
          EM: 'Lớp học đã tồn tại',
          EC: 1,
          DT: []
        });
      }
      // Nếu lớp chưa tồn tại, tiến hành tạo lớp mới
      const newClass = await classAPIService.createClass(req.body);
      return res.status(200).json(newClass);
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
      let data = await classAPIService.deleteClass(id); // Sử dụng đúng service
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
