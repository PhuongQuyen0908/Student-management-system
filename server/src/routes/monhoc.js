import express from 'express';
const router = express.Router();

import subjectController from "../controller/subjectController"

router.get('/read', subjectController.readSubject);
router.get('/getByID/:id', subjectController.getSubjectById);
router.post('/create', subjectController.createSubject);
router.put('/update/:id', subjectController.updateSubject);
router.delete('/delete/:id', subjectController.deleteSubject);

export default router;