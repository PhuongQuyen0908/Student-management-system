import express from 'express';
import apiController from '../controller/apiController.js'
import studentController from '../controller/studentController.js'

const router = express.Router();

/**
 * 
 * @param {*} app : express app 
 */


const initApiRoutes = (app) => {
    //rest api CRUD
    //GET -- read , POST -- create , PUT - update , Delete - Delete
    router.get("/test-api",apiController.testApi) 
   // router.post("/login", apiController.handleLogin);

    router.get("/student/read",studentController.readFunc);
    router.post("/student/create",studentController.createFunc);
    router.put("/student/update",studentController.updateFunc);
    router.delete("/student/delete",studentController.deleteFunc);


    return app.use("/api/v1/" , router);
}

export default initApiRoutes;