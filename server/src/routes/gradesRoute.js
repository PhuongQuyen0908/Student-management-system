const express = require('express');
const gradesController = require('../controller/gradesController');

const router = express.Router();

// API lập báo cáo tổng kết môn học
router.get('/subject-summary', gradesController.getSubjectSummary);

module.exports = router;
