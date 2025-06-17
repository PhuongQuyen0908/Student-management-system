require("dotenv").config();
import cors from "cors";
// const configCors = (app) => {
//   // Add headers before the routes are defined
//   //CORS
//   app.use(function (req, res, next) {
//     // Website you wish to allow to connect
//     console.log("check cors" , req.method);
//     res.setHeader(
//       "Access-Control-Allow-Origin",
//       process.env.REACT_URL || "http://localhost:5173"
//     );

//     // Request methods you wish to allow
//     res.setHeader(
//       "Access-Control-Allow-Methods",
//       "GET, POST, OPTIONS, PUT, PATCH, DELETE"
//     );

//     // Request headers you wish to allow
//     res.setHeader(
//       "Access-Control-Allow-Headers",
//       "X-Requested-With,content-type,Authorization" // add Authorization để có thể tránh cors trong mục setup axios ở frontend
//     );

//     // Set to true if you need the website to include cookies in the requests sent
//     // to the API (e.g. in case you use sessions)
//     res.setHeader("Access-Control-Allow-Credentials", true);

//     if (req.method === "OPTIONS") {
//       return res.sendStatus(200);
//     }

//     // Pass to next layer of middleware
//     next();
//   });
// };

const configCors = (app) => {
  const whitelist = ['http://localhost:5173', 'http://localhost:5174'];

  app.use(cors({
    origin: function (origin, callback) {
      if (!origin || whitelist.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
  }));
};


export default configCors;
