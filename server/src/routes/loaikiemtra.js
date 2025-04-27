import express from 'express';
const router = express.Router();

import testController from "../controller/testController"

router.get('/read', testController.readTest);
router.get('/getByID/:id', testController.getTestById);
router.post('/create', testController.createTest);
router.put('/update/:id', testController.updateTest);
router.delete('/delete/:id', testController.deleteTest);

export default router;