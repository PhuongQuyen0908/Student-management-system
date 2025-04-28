import express from 'express';
import classListController from '..//controller/classListController';

const router = express.Router();

router.get('/read', classListController.readClassList);
router.get('/getById/:id', classListController.getClassListById);
router.post('/create', classListController.createClassList);
router.put('/update/:id', classListController.updateClassList);
router.delete('/delete/:id', classListController.deleteClassList);

export default router;
