import subjectAPIService from "../service/subjectAPIService"; 

// Hàm xử lý lấy tất cả môn học
const readSubject = async (req, res) => {
  try {
    const subjects = await subjectAPIService.getAllSubjects(); 
    if (subjects.length === 0) {
      return res.status(404).json({ message: 'Không có môn học nào trong cơ sở dữ liệu' });
    }
    res.json({ message: 'Danh sách môn ', data: subjects });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Hàm xử lý lấy môn học theo ID
const getSubjectById = async (req, res) => {
  try {
    const id = req.params.id;
    const subject = await subjectAPIService.getSubjectById(id); 
    res.json({ message: 'Môn học tìm thấy', data: subject });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Hàm xử lý tạo môn học mới
const createSubject = async (req, res) => {
  try {
    // Kiểm tra xem môn  đã tồn tại chưa
    const existingSubject = await subjectAPIService.checkSubjectExists(req.body.TenMonHoc);
    if (existingSubject) {
      return res.status(400).json({ message: 'Môn học đã tồn tại, không thể tạo lại.' });
    }

    // Nếu môn học chưa tồn tại, tiến hành tạo môn mới
    const newSubject = await subjectAPIService.createSubject(req.body);
    res.status(201).json({ message: 'Tạo môn thành công', data: newSubject });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Hàm xử lý cập nhật môn học theo ID
const updateSubject = async (req, res) => {
  try {
    const id = req.params.id;
    const updatedSubject = await subjectAPIService.updateSubject(id, req.body);
    if (!updatedSubject) {
      return res.status(404).json({ message: 'Môn  không tồn tại' });
    }
    res.json({ message: 'Cập nhật môn  thành công', data: updatedSubject });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Hàm xử lý xóa môn học
const deleteSubject = async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await subjectAPIService.deleteSubject(id); // Sử dụng đúng service
    if (!deleted) {
      return res.status(404).json({ message: 'Môn  không tồn tại để xóa' });
    }
    res.json({ message: 'Xóa môn  thành công' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Export các hàm
module.exports = {
  readSubject,
  getSubjectById,
  createSubject,
  updateSubject,
  deleteSubject
};
