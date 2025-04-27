import User from "./src/models/user.js";
import bcrypt from 'bcryptjs'
import sequelize from './src/config/connectDB.js';
const userRegister = async() => {
    try {
        const hassPassword = await bcrypt.hash("admin", 10)
        const newUser = new User({
            Name: "Admin",
            Email:"admin@gmail.com",
            Password: hassPassword,
            role: "admin"
        })
        await newUser.save();
    }catch(err){    
        console.log(err);
    }
}

export default userRegister;