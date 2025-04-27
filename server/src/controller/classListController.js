import classListAPIService from '../service/classListAPIService';

const readClassList = async (req, res) => {
  try {
    const danhSach = await classListAPIService.getAllClassList();
    res.status(200).json({ message: 'Danh sách lớp', data: danhSach });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getClassListById = async (req, res) => {
  try {
    const id = req.params.id;
    const danhSach = await classListAPIService.getClassListById(id);
    res.status(200).json({ message: 'Thông tin danh sách lớp', data: danhSach });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const createClassList = async (req, res) => {
  try {
    const created = await classListAPIService.createClassList(req.body);
    res.status(201).json({ message: 'Tạo danh sách lớp thành công', data: created });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateClassList = async (req, res) => {
  try {
    const id = req.params.id;
    const updated = await classListAPIService.updateClassList(id, req.body);
    res.status(200).json({ message: 'Cập nhật danh sách lớp thành công', data: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteClassList = async (req, res) => {
  try {
    const id = req.params.id;
    await classListAPIService.deleteClassList(id);
    res.status(200).json({ message: 'Xóa danh sách lớp thành công' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default {
  readClassList,
  getClassListById,
  createClassList,
  updateClassList,
  deleteClassList
};
