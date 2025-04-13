import express from "express";
import configViewEngine from "./config/viewEngine.js";
import bodyParser from "body-parser";
import initApiRoutes from "./routes/api.js";
import configCors from "./config/cors.js";
require("dotenv").config();
import connection from "./config/connectDB.js";


const app = express();
const PORT = process.env.PORT || 8080;

//config Cors : cho phép front end call api
configCors(app);

//config view engine
configViewEngine(app);

//config body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//test connection
 connection();

//init web routes
// initWebRoutes(app);
 initApiRoutes(app);

app.listen(PORT, () => {
  console.log(">>> JWT Backend is running on the port =" + PORT);
});
