import express from "express";
import apiController from "../controller/apiController.js";
import studentController from "../controller/studentController.js";
import classListController from "../controller/classListController";
import semesterController from "../controller/semesterController";
// import gradeController from "../controller/gradeController" //fix sau
//Fix lại đổi gradeController thành classController
import classGradeController from "../controller/classGradeController";
import testController from "../controller/testController";

import classController from "../controller/classController";
import subjectController from "../controller/subjectController";
import yearController from "../controller/yearController";
import getGradesController from '../controller/getGradesController.js';
import reportController from '../controller/reportController.js';
import gradesController from '../controller/gradesController.js';
import semesterReportController from '../controller/semesterReportController.js';

import sortSubjectController from '../controller/sortSubjectController';
import subjectreportController from '../controller/subjectreportController.js';
import paramenterController from "../controller/paramenterController.js"

// 3/6/2025
import groupController from "../controller/groupController.js";
import permissionController from "../controller/permissionController.js";
import userController from "../controller/userController.js";
import { checkUserJWT, checkUserPermission } from "../middleware/JWTAction.js";

const router = express.Router();

/**
 *
 * @param {*} app : express app
 */

const initApiRoutes = (app) => {
  //rest api CRUD
  //GET -- read , POST -- create , PUT - update , Delete - Delete
  router.get("/test-api", apiController.testApi);
   //middleware
  router.all('*' , checkUserJWT,checkUserPermission)

  //phân quyền
  router.get("/test-api", apiController.testApi);
  router.post("/login", apiController.handleLogin); // login user
  router.post("/logout", apiController.handleLogout); // logout user
  router.get("/account", userController.getUserAccount); // get user account

  //Create group and assign permission to group
  router.post("/group/create", groupController.createFunc);
  router.get("/group/read", groupController.readFunc);
  router.get("/permission/by-group/:groupId", permissionController.getPermissionBygroup); // lấy các quyền của 1 nhóm
  router.get("/permission/read", permissionController.getAllPermissions); // lấy tất cả quyền
  router.post("/permission/assign", permissionController.assignPermissionToGroup); // gán quyền cho nhóm người dùng
  router.get("/group/read-for-admin", groupController.getGroupsForAdmin); // lấy danh sách nhóm cho admin


  //CRUD user
  router.get("/user/read", userController.readFunc);
  router.post("/user/create", userController.createFunc);
  router.put("/user/update", userController.updateFunc);
  router.delete("/user/delete", userController.deleteFunc);
  router.post("/user/change-password", userController.changePassword); // đổi mật khẩu

  //CRUD student
  router.get("/student/read", studentController.readFunc);
  router.post("/student/create", studentController.createFunc);
  router.put("/student/update", studentController.updateFunc);
  router.delete("/student/delete", studentController.deleteFunc);

  //Danh sách lớp
  router.get("/classList/read/", classListController.readClassList);
  router.get("/classList/getById/:id", classListController.getClassListById);
  router.get("/classList/filter", classListController.getClassListByNameAndYear);
  router.post("/classList/create", classListController.createClassList);
  router.put("/classList/update/:id", classListController.updateClassList);
  router.delete("/classList/delete/:id", classListController.deleteClassList);
  router.post("/classList/addStudent", classListController.addStudentToClass);
  router.delete("/classList/removeStudent/:id", classListController.removeStudentFromClass);
  router.get("/classList/getStudentInClass/:id", classListController.readStudentsOfClass);

  //grades
  router.get('/grades/subject-summary', gradesController.getSubjectSummary);
  //học kỳ
  router.get("/semester/read", semesterController.readSemester);
  router.get("/semester/getByID/:id", semesterController.getSemesterById);
  router.post("/semester/create", semesterController.createSemester);
  router.put("/semester/update/:id", semesterController.updateSemester);
  router.delete("/semester/delete/:id", semesterController.deleteSemester);

  // khối
  router.get("/classGrade/read", classGradeController.readClassGrade);
  router.get("/classGrade/getByID/:id", classGradeController.getClassGradeByName);  
  router.post("/classGrade/create", classGradeController.createClassGrade);
  router.put("/classGrade/update/:id", classGradeController.updateClassGrade);
  router.delete("/classGrade/delete/:id", classGradeController.deleteClassGrade);

  //bài kiểm tra
  router.get("/test/read", testController.readTest);
  router.get("/test/getByID/:id", testController.getTestById);
  router.post("/test/create", testController.createTest);
  router.put("/test/update/:id", testController.updateTest);
  router.delete("/test/delete/:id", testController.deleteTest);

  //lớp
  router.get("/class/read", classController.readClass);
  router.get("/class/getById/:id", classController.getClassById);
  router.post("/class/create", classController.createClass);
  router.put("/class/update/:id", classController.updateClass);
  router.delete("/class/delete/:id", classController.deleteClass);

  // Tham số
  router.get("/paramenter/read", paramenterController.getAllParamenters); 
  router.put("/paramenter/update/:id", paramenterController.updateParamenter);

  // môn học
  router.get("/subject/read", subjectController.readSubject);
  router.get("/subject/getByID/:id", subjectController.getSubjectById);
  router.post("/subject/create", subjectController.createSubject);
  router.put("/subject/update/:id", subjectController.updateSubject);
  router.delete("/subject/delete/:id", subjectController.deleteSubject);

  //năm học
  router.get('/year/read', yearController.readSchoolYear);
  router.get('/year/getById/:id', yearController.getSchoolYearById);
  router.post('/year/create', yearController.createSchoolYear);
  router.put('/year/update/:id', yearController.updateSchoolYear);
  router.delete('/year/delete/:id', yearController.deleteSchoolYear);
  
  //report
  // API lấy báo cáo tổng kết môn học
  router.get('/report/subject-summary', gradesController.getSubjectSummary);
  router.get('/report/options', gradesController.getOptions);
  router.post('/report/add-score', gradesController.addScore);
  router.post('/report/delete-score', gradesController.deleteScore);
  router.post('/report/edit-score', gradesController.editScore);
  router.post('/report/semester-report', semesterReportController.tinhBaoCaoTongKetHocKy);
  router.post('/report/subject-report', subjectreportController.tinhBaoCaoTongKetMon);
  router.post('/report/sort-subject-report', sortSubjectController.sortSubjectReport);

  return app.use("/api/", router);
};

export default initApiRoutes;
