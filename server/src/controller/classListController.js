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

const readStudentsOfClass = async (req, res) => {
  try {
    const MaDanhSachLop = req.params.id;
    if (!MaDanhSachLop) {
        return res.status(400).json({ 
            EM: 'Thiếu ID của danh sách lớp.',
            EC: 1, 
            DT: null 
        });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sortField = req.query.sortField || 'HoTen'; // Mặc định sắp xếp theo tên
    const sortOrder = req.query.sortOrder || 'ASC';   // Mặc định thứ tự tăng dần
    const search = req.query.search || '';           // Mặc định không tìm kiếm

    const responseData = await classListAPIService.getAllStudentOfClass(
        MaDanhSachLop, 
        page, 
        limit, 
        sortField, 
        sortOrder, 
        search
    );

    if (responseData.EC === 0) {
        return res.status(200).json(responseData);
    } else if (responseData.EC === 1) {
        return res.status(404).json(responseData);
    } else {
        return res.status(500).json(responseData);
    }

  } catch (error) {
    // Bắt các lỗi không lường trước được (ví dụ: lỗi kết nối DB, lỗi cú pháp...)
    console.error('Lỗi nghiêm trọng trong controller readStudentsOfClass:', error);
    return res.status(500).json({
      EM: 'Đã có lỗi nghiêm trọng xảy ra ở phía server.',
      EC: -1,
      DT: null
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
      EM: danhSach.EM,
      EC: danhSach.EC,
      DT: danhSach.DT,
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
    console.log(req.body);
    const created = await classListAPIService.createClassList(req.body);
    res.status(201).json({ 
      EM: created.EM,
      EC: created.EC,
      DT: created.DT
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
    const { MaDanhSachLop, MaHocSinh, TenLop, TenNamHoc } = req.body;
    if (!MaDanhSachLop && (!TenLop || !TenNamHoc) || !MaHocSinh) {
      return res.status(400).json({ 
        EM: 'Thiếu thông tin danh sách lớp hoặc học sinh',
        EC: 1,
        DT: [] 
      });
    }

    const result = await classListAPIService.addStudentToClass({MaDanhSachLop, MaHocSinh, TenLop, TenNamHoc});
    res.status(201).json({
      EM: result.EM,
      EC: result.EC,
      DT: result.DT
    });
  } catch (error) {
    res.status(500).json({ 
      EM: 'Lỗi server',
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
    const result = await classListAPIService.removeStudentFromClass(id);
    if (result.EC === 0) {
      res.status(200).json({ 
        EM: result.EM,
        EC: result.EC,
        DT: result.DT
      });
    }else if (result.EC === 1 && result.DT === 0) {
      //Trường hợp không tìm thấy
      res.status(404).json({
        EM: result.EM,
        EC: result.EC,
        DT: result.DT
      }) 
      //Trường hợp vi phạm khoa chính - khóa ngoại
    }else {
      res.status(500).json({ 
        EM: result.EM,
        EC: result.EC,
        DT: result.DT
      });
    }
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
  removeStudentFromClass,
  readStudentsOfClass
};