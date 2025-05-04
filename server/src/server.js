import express from "express";
import configCors from "./config/cors.js";
require("dotenv").config();
import configViewEngine from "./config/viewEngine.js";
//import connection from "./config/connectDB.js";
import bodyParser from "body-parser";

const app = express();
const PORT = process.env.PORT || 8083;

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