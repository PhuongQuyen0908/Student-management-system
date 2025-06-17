const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize('qlhs1', 'root', null, {
  host: 'localhost',
  dialect: 'mysql',
  port: 3306
});

const connection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

module.exports = { sequelize, connection };  // 👉 Export đúng CommonJS
