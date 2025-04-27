import semesterAPIService from "../service/semesterAPIService"; 

// Hàm xử lý lấy tất cả học kỳ
const readSemester = async (req, res) => {
  try {
    const semesters = await semesterAPIService.getAllSemesters(); 
    if (semesters.length === 0) {
      return res.status(404).json({ message: 'Không có học kỳ nào trong cơ sở dữ liệu' });
    }
    res.json({ message: 'Danh sách học kỳ ', data: semesters });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Hàm xử lý lấy học kỳ theo ID
const getSemesterById = async (req, res) => {
  try {
    const id = req.params.id;
    const semester = await semesterAPIService.getSemesterById(id); 
    res.json({ message: 'học kỳ tìm thấy', data: semester });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Hàm xử lý tạo học kỳ mới
const createSemester = async (req, res) => {
  try {
    // Kiểm tra xem môn  đã tồn tại chưa
    const existingSemester = await semesterAPIService.checkSemesterxists(req.body.TenHocKy);
    if (existingSemester) {
      return res.status(400).json({ message: 'học kỳ đã tồn tại, không thể tạo lại.' });
    }

    // Nếu học kỳ chưa tồn tại, tiến hành tạo môn mới
    const newSemester = await semesterAPIService.createSemester(req.body);
    res.status(201).json({ message: 'Tạo học kỳ thành công', data: newSemester });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Hàm xử lý cập nhật học kỳ theo ID
const updateSemester = async (req, res) => {
  try {
    const id = req.params.id;
    const updatedSemester = await semesterAPIService.updateSemester(id, req.body);
    if (!updatedSemester) {
      return res.status(404).json({ message: 'Môn  không tồn tại' });
    }
    res.json({ message: 'Cập nhật môn  thành công', data: updatedSemester });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Hàm xử lý xóa học kỳ
const deleteSemester = async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await semesterAPIService.deleteSemester(id); // Sử dụng đúng service
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
  readSemester,
  getSemesterById,
  createSemester,
  updateSemester,
  deleteSemester
};
