import express from "express";
import configCors from "./config/cors.js";
require("dotenv").config();
import configViewEngine from "./config/viewEngine.js";
import connection from "./config/connectDB.js";
import bodyParser from "body-parser";
const app = express();
const PORT = process.env.PORT || 8080;
configCors(app);
configViewEngine(app);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//test connection
 connection();
 //get api
 app.get("/api", (req,res)=> {
  return res.json({message: "This is from backend"});
 })
//init web routes

import authRoutes from "./routes/auth.js";   // ⚡ phải có .js
app.use('/api/auth', authRoutes)

import classRoutes from "./routes/lop.js"
app.use('/api/class', classRoutes)

import gradeRoutes from "./routes/khoi.js"
app.use('/api/grade', gradeRoutes)

import schoolyearRoutes from "./routes/namhoc.js"
app.use('/api/schoolyear', schoolyearRoutes)

import subjectRoutes from "./routes/monhoc.js"
app.use('/api/subject', subjectRoutes)

import semesterRoutes from "./routes/hocky.js"
app.use('/api/semester', semesterRoutes)

import typeOfTranscriptRoutes from "./routes/loaikiemtra.js"
app.use('/api/typeOfTranscript', typeOfTranscriptRoutes)

import classListRoutes from "./routes/danhsachlop.js"
app.use('/api/classList', classListRoutes)
// --------------------- CODE HERE ---------------------------

app.listen(PORT, () => {
  console.log(">>> JWT Backend is running on the port =" + PORT);
});