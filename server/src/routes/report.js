import express from 'express';
import gradesController from '../controller/gradesController.js';
import semesterReportController from '../controller/semesterReportController.js';
import subjectreportController from '../controller/subjectreportController.js'

const router = express.Router();

router.get('/subject-summary', gradesController.getSubjectSummary);

router.get('/options', gradesController.getOptions);

router.post('/add-score', gradesController.addScore);

router.post('/delete-score', gradesController.deleteScore);

router.post('/edit-score', gradesController.editScore);

router.post('/semester-report', semesterReportController.tinhBaoCaoTongKetHocKy);

router.post('/subject-report', subjectreportController.tinhBaoCaoTongKetMon);

export default router;
