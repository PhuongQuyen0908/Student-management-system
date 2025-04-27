import classAPIService from "../service/classAPIService"; // Đảm bảo import đúng service

// Hàm xử lý lấy tất cả lớp học
const readClass = async (req, res) => {
  try {
    const classes = await classAPIService.getAllClasses(); // Lấy ra tất cả các lớp
    if (classes.length === 0) {
      return res.status(404).json({ message: 'Không có lớp học nào trong cơ sở dữ liệu' });
    }
    res.json({ message: 'Danh sách lớp', data: classes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Hàm xử lý lấy lớp học theo ID
const getClassById = async (req, res) => {
  try {
    const id = req.params.id;
    const oneClass = await classAPIService.getClassById(id); 
    res.json({ message: 'Lớp học tìm thấy', data: oneClass });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Hàm xử lý tạo lớp học mới
const createClass = async (req, res) => {
  try {
    // Kiểm tra xem lớp đã tồn tại chưa
    const existingClass = await classAPIService.checkClassExists(req.body.TenLop);
    if (existingClass) {
      return res.status(400).json({ message: 'Lớp đã tồn tại, không thể tạo lại.' });
    }

    // Nếu lớp chưa tồn tại, tiến hành tạo lớp mới
    const newClass = await classAPIService.createClass(req.body);
    res.status(201).json({ message: 'Tạo lớp thành công', data: newClass });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Hàm xử lý cập nhật lớp học
const updateClass = async (req, res) => {
  try {
    const id = req.params.id;
    const updatedClass = await classAPIService.updateClass(id, req.body);
    if (!updatedClass) {
      return res.status(404).json({ message: 'Lớp không tồn tại' });
    }
    res.json({ message: 'Cập nhật lớp thành công', data: updatedClass });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Hàm xử lý xóa lớp học
const deleteClass = async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await classAPIService.deleteClass(id); // Sử dụng đúng service
    if (!deleted) {
      return res.status(404).json({ message: 'Lớp không tồn tại để xóa' });
    }
    res.json({ message: 'Xóa lớp thành công' });
  } catch (error) {
    res.status(500).json({ message: error.message });
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
