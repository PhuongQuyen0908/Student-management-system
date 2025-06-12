
import db from "../models/index";
import {createJWT } from '../middleware/JWTAction.js'
import {getGroupWithRoles } from './JWTServices.js'
require("dotenv").config()




const checkPassword = (inputPassword , databasePassword) =>{
    return inputPassword ===  databasePassword;
}

const handleUserLogin = async (rawData) =>{
  try {
    
    let user =  await db.nguoidung.findOne({
       where: {TenDangNhap: rawData.valueLogin}
    })

    if (user) {
      let isCorrectPassword = checkPassword(rawData.password, user.MatKhau);
      if (isCorrectPassword === true) {
        //let token

        //test roles:
        let groupWithPermissions = await getGroupWithRoles(user);
        let payload ={
          groupWithPermissions,
          username: user.TenDangNhap,
          HoTen: user.HoTen,
        }
        let token = createJWT(payload);
        return {
          EM: "ok!",
          EC: 0,
          DT: {
            access_token:token,
            groupWithPermissions: groupWithPermissions,
            username: user.TenDangNhap,
            HoTen: user.HoTen,
          },
        };
      }
    }
    console.log("Input user with email/phone", rawData.valueLogin ,"password ",rawData.password );
    return {
      EM: "Your email/phone or password is incorrect!",
      EC: -1,
      DT: "",
    };
    

  } catch (error) {
    console.log(error)
    return {
      EM: "Something wrongs in service...",
      EC: -2,
    };
  }
}

module.exports = {
  handleUserLogin , 
}