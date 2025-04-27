import express from 'express';
const router = express.Router();

import classController from "../controller/classController"

router.get('/read', classController.readClass);
router.get('/getById/:id', classController.getClassById);
router.post('/create', classController.createClass);
router.put('/update/:id', classController.updateClass);
router.delete('/delete/:id', classController.deleteClass);

export default router;