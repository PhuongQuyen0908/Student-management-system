// src/routes/gradesRoute.js
const express = require('express');
const gradesController = require('../controller/gradeController');

const router = express.Router();

// API lấy bảng điểm môn học
router.get('/grades', gradesController.getGrades);

module.exports = router;
