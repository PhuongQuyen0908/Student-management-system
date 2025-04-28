import express from 'express';
const router = express.Router();

import gradeController from "../controller/gradeController"

router.get('/read', gradeController.readGrade);
router.get('/getByID/:id', gradeController.getGradeById);
router.post('/create', gradeController.createGrade);
router.put('/update/:id', gradeController.updateGrade);
router.delete('/delete/:id', gradeController.deleteGrade);

export default router;