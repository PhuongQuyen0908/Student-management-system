import { parse } from "dotenv";
import subjectAPIService from "../service/subjectAPIService"; 

// Hàm xử lý lấy tất cả môn học
const readSubject = async (req, res) => {
  try {
    let page = req.query.page ? parseInt(req.query.page) : 1; // Lấy số trang từ query, mặc định là 1
    let limit = req.query.limit ? parseInt(req.query.limit) : 7; // Lấy giới hạn số lượng môn học trên mỗi trang, mặc định là 7
    let sortField = req.query.sortField || 'MaMonHoc'; // Trường sắp xếp, mặc định là MaMonHoc
    let sortOrder = req.query.sortOrder || 'asc'; // Thứ tự sắp xếp, mặc định là 'asc'
    let search = req.query.search || ''; // Lấy từ khóa tìm kiếm từ query, mặc định là rỗng
    let data;
    if(search) {
      // Nếu có từ khóa tìm kiếm, gọi service để tìm kiếm theo từ khóa
      data = await subjectAPIService.getAllSubjectWithSearch(search, page, limit, sortField, sortOrder);
    }else if(req.query.page && req.query.limit) {
      // Không có search nhưng có phân trang, gọi service để lấy danh sách môn học với phân trang
      data = await subjectAPIService.getAllSubjectsWithPagination(page, limit, sortField, sortOrder);
    }else{
      // Không có search và không có phân trang, gọi service để lấy tất cả môn học
      data = await subjectAPIService.getAllSubjects();
    }
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      EM: 'Lỗi phía server',
      EC: 1, // Mã lỗi
      DT: [] // Dữ liệu trả về
    });
}};

// Hàm xử lý lấy môn học theo ID
const getSubjectById = async (req, res) => {
  try {
    const id = req.params.id;
    const subject = await subjectAPIService.getSubjectById(id); 
    return res.status(200).json({
      EM: subject.EM,
      EC: subject.EC,
      DT: subject.DT
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      EM: 'Lỗi phía server',
      EC: 1, // Mã lỗi
      DT: [] // Dữ liệu trả về
    });
  }
};

// Hàm xử lý tạo môn học mới
const createSubject = async (req, res) => {
  try {
    // Kiểm tra xem môn  đã tồn tại chưa
    const { TenMonHoc, HeSo } = req.body;
    if (HeSo < 0 ) {
      return res.status(400).json({
        EM: 'Hệ số phải lớn hơn hoặc bằng 0',
        EC: 1,
        DT: []
      });
    }
    const existingSubject = await subjectAPIService.checkSubjectExists(req.body.TenMonHoc);
    if (existingSubject.EC === 0) {
      // HTTP 409 Conflict: Môn học đã tồn tại
      return res.status(409).json({
        EM: 'Môn học đã tồn tại',
        EC: 1,
        DT: existingSubject.DT
      })
    }
    // Nếu môn học chưa tồn tại, tiến hành tạo môn mới
    const newSubject = await subjectAPIService.createSubject(req.body);
    return res.status(201).json({
      EM: newSubject.EM,
      EC: newSubject.EC,
      DT: newSubject.DT
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      EM: 'Lỗi phía server',
      EC: -1,
      DT: [] 
    });
  }
};


// Hàm xử lý cập nhật môn học theo ID
const updateSubject = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { TenMonHoc, HeSo } = req.body;
    // Kiểm tra xem hệ số có hợp lệ không
    if (HeSo < 0) {
      return res.status(400).json({
        EM: 'Hệ số phải lớn hơn hoặc bằng 0',
        EC: 1,
        DT: []
      });
    }

    // Kiểm tra xem môn học có tồn tại không
    const existingSubject = await subjectAPIService.getSubjectById(id);
    if (!existingSubject || existingSubject.EC !== 0) {
      // HTTP 404 Not Found: Môn học không tồn tại
      return res.status(404).json({
        EM: 'Môn học không tồn tại',
        EC: 1,
        DT: {}
      });
    }
    // kiểm tra xem có môn học nào có tên giống như môn học đang cập nhật không
    const checkSubject = await subjectAPIService.checkSubjectExists(req.body.TenMonHoc);

    // Kiểm tra lỗi logic và xung đột
    //Nếu tên môn học đã tồn tại và không phải là chính môn học đang cập nhật
    if (checkSubject.EC === 0 && checkSubject.DT.MaMonHoc !== id) {
      // HTTP 409 Conflict: Môn học đã tồn tại
      return res.status(409).json({
        EM: `Tên môn học "${req.body.TenMonHoc}" đã được sử dụng.`,
        EC: 1,
        DT: checkSubject.DT
      });
    } 

    const { MaMonHoc, ...dataToUpdate } = req.body;
    // Nếu môn học chưa tồn tại hoặc là chính môn học đang cập nhật, tiến hành cập nhật
    const updatedSubject = await subjectAPIService.updateSubject(id, dataToUpdate);
    return res.status(200).json({
      EM: updatedSubject.EM,
      EC: updatedSubject.EC,
      DT: updatedSubject.DT
    }); 
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      EM: 'Lỗi phía server',
      EC: -1,
      DT: [] 
    });
  }
};

// Hàm xử lý xóa môn học
const deleteSubject = async (req, res) => {
  try {
    const id = req.params.id;
    // Kiểm tra xem môn học có tồn tại không
    const existingSubject = await subjectAPIService.getSubjectById(id);
    if (!existingSubject || existingSubject.EC !== 0) {
      // HTTP 404 Not Found: Môn học không tồn tại
      return res.status(404).json({
        EM: 'Môn học không tồn tại',
        EC: 1,
        DT: {}
      });
    }
    // Nếu môn học tồn tại, tiến hành xóa
    const deleted = await subjectAPIService.deleteSubject(id); // Sử dụng đúng service
    if (deleted) {
      return res.status(200).json({
        EM: deleted.EM,
        EC: deleted.EC,
        DT: deleted.DT
      });
    } 
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      EM: 'Lỗi phía server',
      EC: -1,
      DT: [] 
    });
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
