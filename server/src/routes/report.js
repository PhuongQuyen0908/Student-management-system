import express from 'express';
import gradesController from '../controller/gradesController.js';
import reportController from '../controller/reportController.js';

const router = express.Router();

// API lấy báo cáo tổng kết môn học
router.get('/subject-summary', gradesController.getSubjectSummary);

// API lấy danh sách lớp, năm học, học kỳ, môn học
router.get('/options', reportController.getOptions);

export default router;
