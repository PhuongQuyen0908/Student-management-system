import testAPIService from "../service/testAPIService"; 

// Hàm xử lý lấy tất cả loại kiểm tra
const readTest = async (req, res) => {
  try {
    const tests = await testAPIService.getAllTests(); 
    if (tests.length === 0) {
      return res.status(404).json({ message: 'Không có loại kiểm tra nào trong cơ sở dữ liệu' });
    }
    res.json({ message: 'Danh sách loại kiểm tra', data: tests });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Hàm xử lý lấy loại kiểm tra theo ID
const getTestById = async (req, res) => {
  try {
    const id = req.params.id;
    const test = await testAPIService.getTestById(id); 
    res.json({ message: 'Loại kiểm tra tìm thấy', data: test });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Hàm xử lý tạo loại kiểm tra mới
const createTest = async (req, res) => {
  try {
    // Kiểm tra xem loại kiểm tra đã tồn tại chưa
    const existingTest = await testAPIService.checkTestExists(req.body.TenLoaiKiemTra);
    if (existingTest) {
      return res.status(400).json({ message: 'Loại kiểm tra đã tồn tại, không thể tạo lại.' });
    }

    // Nếu loại kiểm tra chưa tồn tại, tiến hành tạo môn mới
    const newTest = await testAPIService.createTest(req.body);
    res.status(201).json({ message: 'Tạo loại kiểm tra thành công', data: newTest });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Hàm xử lý cập nhật loại kiểm tra theo ID
const updateTest = async (req, res) => {
  try {
    const id = req.params.id;
    const updatedTest = await testAPIService.updateTest(id, req.body);
    if (!updatedTest) {
      return res.status(404).json({ message: 'Loại kiểm tra không tồn tại' });
    }
    res.json({ message: 'Cập nhật loại kiểm tra  thành công', data: updatedTest });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Hàm xử lý xóa môn học
const deleteTest = async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await testAPIService.deleteTest(id); // Sử dụng đúng service
    if (!deleted) {
      return res.status(404).json({ message: 'Loại kiểm tra  không tồn tại để xóa' });
    }
    res.json({ message: 'Xóa loại kiểm tra thành công' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Export các hàm
module.exports = {
  readTest,
  getTestById,
  createTest,
  updateTest,
  deleteTest
};
