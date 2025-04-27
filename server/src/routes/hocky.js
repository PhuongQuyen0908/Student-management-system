import express from 'express';
const router = express.Router();

import semesterController from "../controller/semesterController"

router.get('/read', semesterController.readSemester);
router.get('/getByID/:id', semesterController.getSemesterById);
router.post('/create', semesterController.createSemester);
router.put('/update/:id', semesterController.updateSemester);
router.delete('/delete/:id', semesterController.deleteSemester);

export default router;