import express from 'express';
import gradesController from '../controller/gradesController.js';
import subjectreportController from '../controller/subjectreportController.js';
import semesterReportController from '../controller/semesterReportController.js';
//const { baoCaoTongKetMonTheoTen } = require('../controller/baoCaoController');

const router = express.Router();

router.get('/subject-summary', gradesController.getSubjectSummary);

router.get('/options', gradesController.getOptions);

router.post('/add-score', gradesController.addScore);

router.post('/delete-score', gradesController.deleteScore);

router.post('/edit-score', gradesController.editScore);

router.post('/subject-report', subjectreportController.tinhBaoCaoTongKetMon);

router.post('/semester-report', semesterReportController.tinhBaoCaoTongKetHocKy);

export default router;
