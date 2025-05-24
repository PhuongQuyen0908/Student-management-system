import gradeAPIService from '../service/gradeAPIService.js';

const readClassGrade = async (req, res) => {
  try {
    const data = await gradeAPIService.getAllGrades();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      EC: -1,
      EM: error.message,
    });
  }
}

const getClassGradeByName = async (req, res) => {
  try {
    const { GradeName } = req.params;
    const data = await gradeAPIService.getGradeByName(GradeName);
    if (data.EC === 1) {
      return res.status(404).json({
        EC: 1,
        EM: "Khối không tồn tại",
      });
    }
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      EC: -1,
      EM: error.message,
    });
  }
}

const createClassGrade = async (req, res) => {
  try {
    const { GradeName } = req.body;
    const isExists = await gradeAPIService.checkGradeExists(GradeName);
    if (isExists) {
      return res.status(400).json({
        EC: 1,
        EM: "Khối học đã tồn tại",
      });
    }
    const newGrade = await gradeAPIService.createGrade({ TenKhoi: GradeName });
    return res.status(201).json({
      EC: 0,
      EM: "Tạo khối học thành công",
      DT: newGrade,
    });
  } catch (error) {
    return res.status(500).json({
      EC: -1,
      EM: error.message,
    });
  }
}   
const updateClassGrade = async (req, res) => {
  try {
    const { id } = req.params;
    const { GradeName } = req.body;
    const isExists = await gradeAPIService.checkGradeExists(GradeName);
    if (isExists) {
      return res.status(400).json({
        EC: 1,
        EM: "Khối học đã tồn tại",
      });
    }
    const updatedGrade = await gradeAPIService.updateGrade(id, { TenKhoi: GradeName });
    return res.status(200).json({
      EC: 0,
      EM: "Cập nhật khối học thành công",
      DT: updatedGrade,
    });
  } catch (error) {
    return res.status(500).json({
      EC: -1,
      EM: error.message,
    });
  }
}
const deleteClassGrade = async (req, res) => {
  try {
    const { id } = req.params;
    const gradeToDelete = await gradeAPIService.getGradeById(id);
    if (!gradeToDelete) {
      return res.status(404).json({
        EC: 1,
        EM: "Khối học không tồn tại",
      });
    }
    await gradeToDelete.destroy();
    return res.status(200).json({
      EC: 0,
      EM: "Xóa khối học thành công",
    });
  } catch (error) {
    return res.status(500).json({
      EC: -1,
      EM: error.message,
    });
  }
}
export default {
  readClassGrade,
  getClassGradeByName,
  createClassGrade,
  updateClassGrade,
  deleteClassGrade,
};