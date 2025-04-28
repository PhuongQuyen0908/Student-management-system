const { Sequelize } = require('sequelize');
require("dotenv").config();

//Kết nối database
const sequelize = new Sequelize('studentmanagementsystem', 'root', null, {
   host: 'localhost',
   dialect: 'mysql',
   port: 3307
 });

// Kiểm tra xem kết nối đã thành công chưa
const connection = async () =>{
 try {
   await sequelize.authenticate();
   console.log('Connection has been established successfully.');
 } catch (error) {
   console.error('Unable to connect to the database:', error);
 }
}

export default connection