import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import {User} from "../models"

const login = async (req, res) => {
    try {
        console.log(req.body)
        const { email, password } = req.body;
        const user = await User.findOne({ where: { Email: email } }); // findOne và cần where
        if (!user) {
            console.log("User not found:", email);
            return res.status(400).json({ success: false, error: "User not found" });
        }

        // const isMatch = await bcrypt.compare(password, user.Password);
        const isMatch = password === user.Password
        if (!isMatch) {
            console.log("Wrong password for:", email);
            console.log(password, user.Password)
            return res.status(400).json({ success: false, error: "Wrong Password" });
        }

        const token = jwt.sign(
            { id: user.UserID, role: user.Role },
            process.env.JWT_KEY,
            { expiresIn: "10d" }
        );

        console.log("Login successfully!!!")
        res.status(200).json({
            success: true,
            token,
            user: {
                id: user.UserID,
                name: user.Name,
                email: user.Email,
                role: user.Role
            }
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, error: "Server error" });
    }
};

export default login;
