import yearAPIService from "../service/yearAPIService"

// Hàm xử lý lấy tất cả năm học học
const readSchoolYear = async (req, res) => {
  try {
    const years = await yearAPIService.getAllSchoolYears(); // Lấy ra tất cả các năm học
    if (years.length === 0) {
      return res.status(404).json({ message: 'Không có năm học học nào trong cơ sở dữ liệu' });
    }
    res.json({ message: 'Danh sách năm học', data: years });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Hàm xử lý lấy năm học học theo ID
const getSchoolYearById = async (req, res) => {
  try {
    const id = req.params.id;
    const oneSchoolYear = await yearAPIService.getSchoolYearById(id); 
    res.json({ message: 'Năm học học tìm thấy', data: oneSchoolYear });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Hàm xử lý tạo năm học học mới
const createSchoolYear = async (req, res) => {
  try {
    // Kiểm tra xem năm học đã tồn tại chưa
    const existingSchoolYear = await yearAPIService.checkSchoolYearExists(req.body.NamHoc);
    if (existingSchoolYear) {
      return res.status(400).json({ message: 'Năm học đã tồn tại, không thể tạo lại.' });
    }

    // Nếu năm học chưa tồn tại, tiến hành tạo năm học mới
    const newSchoolYear = await yearAPIService.createSchoolYear(req.body);
    res.status(201).json({ message: 'Tạo năm học thành công', data: newSchoolYear });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Hàm xử lý cập nhật năm học học
const updateSchoolYear = async (req, res) => {
  try {
    const id = req.params.id;
    const updatedSchoolYear = await yearAPIService.updateSchoolYear(id, req.body);
    if (!updatedSchoolYear) {
      return res.status(404).json({ message: 'Năm học không tồn tại' });
    }
    res.json({ message: 'Cập nhật năm học thành công', data: updatedSchoolYear });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Hàm xử lý xóa năm học học
const deleteSchoolYear = async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await yearAPIService.deleteSchoolYear(id); // Sử dụng đúng service
    if (!deleted) {
      return res.status(404).json({ message: 'Năm học không tồn tại để xóa' });
    }
    res.json({ message: 'Xóa năm học thành công' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Export các hàm
module.exports = {
  readSchoolYear,
  getSchoolYearById,
  createSchoolYear,
  updateSchoolYear,
  deleteSchoolYear
};
