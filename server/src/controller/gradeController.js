import gradeAPIService from "../service/gradeAPIService"

// Hàm lấy tất cả các khối
const readGrade = async (req, res) => {
    try {
      const grades = await gradeAPIService.getAllGrades();
      if (!grades || grades.length === 0) {
        return res.status(404).json({
          message: 'Không tìm thấy khối nào trong cơ sở dữ liệu',
          error: 'NOT_FOUND'
        });
      }
      res.status(200).json({
        message: 'Danh sách khối',
        data: grades,
      });
    } catch (error) {
      res.status(500).json({
        message: 'Lỗi khi lấy danh sách khối.',
        error: error.message || error,
      });
    }
};
  
// Hàm lấy khối theo ID
const getGradeById = async (req, res) => {
    try {
      let id = req.params.id;
      const grade = await gradeAPIService.getGradeById(id);
      if (!grade) {
        return res.status(404).json({
          message: `Không tìm thấy khối với ID: ${id}`,
          error: 'NOT_FOUND'
        });
      }
      res.status(200).json({
        message: 'Lấy khối thành công',
        data: grade,
      });
    } catch (error) {
      res.status(500).json({
        message: `Lỗi khi lấy khối với ID: ${req.params.id}`,
        error: error.message || error,
      });
    }
};

const createGrade = async (req,res) => {
    try{
        //Kiểm tra khối đã tồn tại chưa
        const existingGrade = await gradeAPIService.checkGradeExists(req.body.TenKhoi);
        if (existingGrade) {
              return res.status(400).json({ message: 'Khôi đã tồn tại, không thể tạo lại.' });
        }
        // Nếu khối chưa tồn tại, tiến hành tạo khối mới
        const newGrade = await gradeAPIService.createGrade(req.body);
        res.status(201).json({ message: 'Tạo khối thành công ', data: newGrade });
    } catch (error){
            res.status(500).json({ message:'Tạo khối thất bại '+ error.message });
    }
}
  
// Cập nhật khối học (thay đổi tên khối)
const updateGrade = async (req, res) => {
    try {
    let id = req.params.id
    const updatedGrade = await gradeAPIService.updateGrade(id, req.body);
    if(!updatedGrade){
        return res.status(404).json({ message: 'Khối không tồn tại' });
    }
    res.json({
        message: 'Cập nhật khối thành công',
        data: updatedGrade,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };

  
// Xóa khối học
const deleteGrade = async (req, res) => {
    try {
    const id = req.params.id;
    const deleted = await gradeAPIService.deleteGrade(id);
    if(!deleted){
        return res.status(404).json({message: 'Khối không tồn tại để xóa'});
    }
    res.json({
        message: 'Xóa khối thành công',
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };

module.exports = {
    readGrade,
    getGradeById,
    createGrade,
    updateGrade,
    deleteGrade
}