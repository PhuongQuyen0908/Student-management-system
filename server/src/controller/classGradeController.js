import gradeAPIService from '../service/gradeAPIService.js';

// Lấy danh sách khối học (có tìm kiếm & phân trang nếu có)
const readClassGrade = async (req, res) => {
  try {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const sortField = req.query.sortField || 'MaKhoi';
    const sortOrder = req.query.sortOrder || 'ASC';
    const search = req.query.search || '';

    let data;
    if (search) {
      data = await gradeAPIService.getAllGradesWithSearch(search, page, limit, sortField, sortOrder);
    } else if (req.query.page && req.query.limit) {
      data = await gradeAPIService.getAllGradesWithSearch('', page, limit, sortField, sortOrder);
    } else {
      data = await gradeAPIService.getAllGrades();
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      EM: 'Lỗi phía server',
      EC: -1,
      DT: [],
    });
  }
};

// Lấy khối theo tên
const getClassGradeByName = async (req, res) => {
  try {
    const { GradeName } = req.params;
    const data = await gradeAPIService.getGradeByName(GradeName);
    if (data.EC === 1) {
      return res.status(404).json(data);
    }
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      EM: error.message,
      EC: -1,
      DT: [],
    });
  }
};

// Tạo khối học mới
const createClassGrade = async (req, res) => {
  try {
    const { GradeName } = req.body;
    const isExists = await gradeAPIService.checkGradeExists(GradeName);
    if (isExists) {
      return res.status(409).json({
        EM: "Khối học đã tồn tại",
        EC: 1,
        DT: "",
      });
    }
    const data = await gradeAPIService.createGrade({ GradeName });
    return res.status(201).json(data);
  } catch (error) {
    return res.status(500).json({
      EM: error.message,
      EC: -1,
      DT: "",
    });
  }
};

// Cập nhật khối học
const updateClassGrade = async (req, res) => {
  try {
    const { id } = req.params;
    const { GradeName } = req.body;

    const isExists = await gradeAPIService.checkGradeExists(GradeName);
    if (isExists) {
      return res.status(409).json({
        EM: "Khối học đã tồn tại. Bạn không thể cập nhật khối học với tên này.",
        EC: 1,
        DT: "",
      });
    }

    const data = await gradeAPIService.updateGrade(id, { GradeName });
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      EM: error.message,
      EC: -1,
      DT: "",
    });
  }
};

// Xoá khối học
const deleteClassGrade = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await gradeAPIService.deleteGrade(id);
    if (result.EC === 0) {
      return res.status(200).json(result);
    } else if (result.EC === 1) {
      return res.status(404).json(result);
    } else if (result.EC === 2) {
      return res.status(409).json(result);
    } else {
      return res.status(400).json(result);
    }
  } catch (error) {
    return res.status(500).json({
      EM: error.message,
      EC: -1,
      DT: "",
    });
  }
};

export default {
  readClassGrade,
  getClassGradeByName,
  createClassGrade,
  updateClassGrade,
  deleteClassGrade,
};
