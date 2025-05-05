import express from 'express';
import gradesController from '../controller/gradesController.js';
import reportController from '../controller/reportController.js';
//const { baoCaoTongKetMonTheoTen } = require('../controller/baoCaoController');

const router = express.Router();

// API lấy báo cáo tổng kết môn học
router.get('/subject-summary', gradesController.getSubjectSummary);

// API lấy danh sách lớp, năm học, học kỳ, môn học
router.get('/options', reportController.getOptions);


// ✅ Sửa lại như sau:
//router.post('/update-student-scores', gradesController.updateStudentScores);

router.post('/add-score', gradesController.addScore);
router.post('/delete-score', gradesController.deleteScore);
router.post('/edit-score', gradesController.editScore);

export default router;
