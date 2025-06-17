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
    const existingSchoolYear = await yearAPIService.checkSchoolYearExists(req.body.TenNamHoc);
    if (existingSchoolYear) {
      return res.status(400).json({ EM: 'Năm học đã tồn tại', EC: 1, DT: null });
    } 
    const newSchoolYear = await yearAPIService.createSchoolYear(req.body);
    res.status(201).json({ EM: newSchoolYear.EM, EC: newSchoolYear.EC, DT: newSchoolYear.DT });
  } catch (error) {
    res.status(500).json({ EM: "Lỗi khi tạo năm học: " + error.message, EC: -1, DT: null });
  }
};


// Hàm xử lý cập nhật năm học học
const updateSchoolYear = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const result = await yearAPIService.updateSchoolYear(id, data);
    if (result.EC === 0) {
      return res.status(200).json(result);
    } else if (result.EC === 1) {
      return res.status(404).json(result);
    } else if (result.EC === 2) {
      // Lỗi trùng tên hoặc ràng buộc khóa ngoại
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

const getSchoolYearsWithPagination = async (req, res) => {
  try {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const sortField = req.query.sortField || 'MaNamHoc';
    const sortOrder = req.query.sortOrder || 'ASC';
    const search = req.query.search || '';

    const data = await yearAPIService.getSchoolYearsWithPagination(search, page, limit, sortField, sortOrder);
    
    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ 
      EM: "Lỗi server khi lấy danh sách năm học", 
      EC: -1, 
      DT: [] 
    });
  }
};

// Export các hàm
module.exports = {
  readSchoolYear,
  getSchoolYearById,
  createSchoolYear,
  updateSchoolYear,
  deleteSchoolYear,
  getSchoolYearsWithPagination
};
