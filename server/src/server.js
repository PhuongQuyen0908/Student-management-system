import express from "express";
import configCors from "./config/cors.js";
require("dotenv").config();
import configViewEngine from "./config/viewEngine.js";
//import connection from "./config/connectDB.js";
import bodyParser from "body-parser";
const path = require("path");

const app = express();
const PORT = process.env.PORT || 8083;

const rootDir = path.resolve(); // trỏ về thư mục gốc project
console.log(">>> rootDir =", rootDir); 
//app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(rootDir, "/public/uploads")));
console.log(">>> uploads path = " + path.join(rootDir, "public/uploads"));

import { connection } from './config/connectDB.js'; 
configCors(app);
configViewEngine(app);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
import initApiRoutes from "./routes/api.js";

//test connection
connection();
 //get api
 app.get("/api", (req,res)=> {
  return res.json({message: "This is from backend"});
 })

initApiRoutes(app);



app.listen(PORT, () => {
  console.log(">>> JWT Backend is running on the port =" + PORT);
});