import classListAPIService from '../service/classListAPIService';

const readClassList = async (req, res) => {
  try {
    const danhSach = await classListAPIService.getAllClassList();
    res.status(200).json({ 
      EM: 'Danh sách lớp', 
      EC: 0, 
      DT: danhSach 
    });
  } catch (error) {
    res.status(500).json({ 
      EM: error.message,
      EC: -1,
      DT: [] 
    });
  }
};

const getClassListById = async (req, res) => {
  try {
    const id = req.params.id;
    const danhSach = await classListAPIService.getClassListById(id);
    res.status(200).json({ 
      EM: 'Thông tin danh sách lớp', 
      EC: 0, 
      DT: danhSach 
    });
  } catch (error) {
    res.status(404).json({ 
      EM: error.message,
      EC: 1,
      DT: [] 
    });
  }
};

const getClassListByNameAndYear = async (req, res) => {
  try {
    const { tenLop, namHoc } = req.query;
    if (!tenLop || !namHoc) {
      return res.status(400).json({ 
        EM: 'Thiếu thông tin lớp hoặc năm học',
        EC: 1,
        DT: [] 
      });
    }
    
    const danhSach = await classListAPIService.getClassListByNameAndYear(tenLop, namHoc);
    res.status(200).json({ 
      EM: 'Lấy danh sách lớp thành công',
      EC: 0,
      DT: danhSach 
    });
  } catch (error) {
    res.status(500).json({ 
      EM: error.message,
      EC: -1,
      DT: [] 
    });
  }
};

const createClassList = async (req, res) => {
  try {
    const created = await classListAPIService.createClassList(req.body);
    res.status(201).json({ 
      EM: 'Tạo danh sách lớp thành công',
      EC: 0,
      DT: created 
    });
  } catch (error) {
    res.status(500).json({ 
      EM: error.message,
      EC: -1,
      DT: [] 
    });
  }
};

const updateClassList = async (req, res) => {
  try {
    const id = req.params.id;
    const updated = await classListAPIService.updateClassList(id, req.body);
    res.status(200).json({ 
      EM: 'Cập nhật danh sách lớp thành công',
      EC: 0,
      DT: updated 
    });
  } catch (error) {
    res.status(500).json({ 
      EM: error.message,
      EC: -1,
      DT: [] 
    });
  }
};

const deleteClassList = async (req, res) => {
  try {
    const id = req.params.id;
    await classListAPIService.deleteClassList(id);
    res.status(200).json({ 
      EM: 'Xóa danh sách lớp thành công',
      EC: 0,
      DT: [] 
    });
  } catch (error) {
    res.status(500).json({ 
      EM: error.message,
      EC: -1,
      DT: [] 
    });
  }
};

const addStudentToClass = async (req, res) => {
  try {
    const { MaDanhSachLop, MaHocSinh } = req.body;
    if (!MaDanhSachLop || !MaHocSinh) {
      return res.status(400).json({ 
        EM: 'Thiếu thông tin danh sách lớp hoặc học sinh',
        EC: 1,
        DT: [] 
      });
    }
    
    const result = await classListAPIService.addStudentToClass(MaDanhSachLop, MaHocSinh);
    res.status(201).json({ 
      EM: 'Thêm học sinh vào lớp thành công',
      EC: 0,
      DT: result 
    });
  } catch (error) {
    res.status(500).json({ 
      EM: error.message,
      EC: -1,
      DT: [] 
    });
  }
};

const removeStudentFromClass = async (req, res) => {
  try {
    const id = req.params.id; // This is the MaCT_DSL (ID of the class list detail)
    if (!id) {
      return res.status(400).json({ 
        EM: 'Thiếu thông tin chi tiết danh sách lớp',
        EC: 1,
        DT: [] 
      });
    }
    
    await classListAPIService.removeStudentFromClass(id);
    res.status(200).json({ 
      EM: 'Xóa học sinh khỏi lớp thành công',
      EC: 0,
      DT: [] 
    });
  } catch (error) {
    res.status(500).json({ 
      EM: error.message,
      EC: -1,
      DT: [] 
    });
  }
};

export default {
  readClassList,
  getClassListById,
  createClassList,
  updateClassList,
  deleteClassList,
  getClassListByNameAndYear,
  addStudentToClass,
  removeStudentFromClass
};