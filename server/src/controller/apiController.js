//viết api login
import loginService from "../service/loginService.js";

const testApi = (req, res) => {
    //   return res.status(200).json({
    //     message: "Hello world",
    //   });
      console.log("test api");
      return res.send("test api");
    }
    
  const handleLogin = async (req, res) => {
  try {
    let data = await loginService.handleUserLogin(req.body);
    console.log("check data", data);
    //set cookie
    if (data && data.DT && data.DT.access_token) {
      res.cookie("jwt", data.DT.access_token, {
        httpOnly: true,
        maxAge: 60 * 60 * 1000, //giới hạn 1 hour
      });
    }
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    return res.status(500).json({
      EM: "error from server", //error message
      EC: "-1", //error code
      DT: "", //data
    });
  }
};
    module.exports = {testApi ,handleLogin};