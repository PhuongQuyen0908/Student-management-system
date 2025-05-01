import express from 'express';
const router = express.Router();

import yearController from "../controller/yearController"

router.get('/read', yearController.readSchoolYear);
router.get('/getById/:id', yearController.getSchoolYearById);
router.post('/create', yearController.createSchoolYear);
router.put('/update/:id', yearController.updateSchoolYear);
router.delete('/delete/:id', yearController.deleteSchoolYear);

export default router;