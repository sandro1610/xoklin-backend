import Users from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import key from "../config/key.js";
export const login = async (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;
        const user = await Users.findOne({
            where: { username: username }
        });
        if (!user) return res.status(404).json({ message: "User not found" });
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(403).json({ message: "Wrong Password" });
        const userId = user.idUser;
        const name = user.name;
        const role = user.role;
        const accessToken = jwt.sign({ userId, name, role, username }, key.ACCESS_TOKEN_SECRET,{"expiresIn": "30d"});
        res.status(200).json({ token : accessToken })
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
}
export const me = async (req, res) => {
    try {
        if(!req.userId){
            return res.status(401).json({message: 'Login Required'});
        }
        const user = await Users.findOne({
            attributes: {exclude: ['password']},
            where: {
                idUser: req.userId,
            }
        });
        if(!user) return res.status(400).json({ message: 'User not found' });
        res.status(200).json({data : user});
    } catch (error) {
        res.status(400).json({message: error.message});
    }
} 
export const usePasswordHashToMakeToken = ({
    password,
    id,
    createdAt,
  }) => {
    const secret = password + "-" + createdAt;
    const token = jwt.sign({ id }, secret, { expiresIn: 3600 });
    return token;
}
  
export const forgetPassword = async (req, res) => {
    try {
        console.log(req.body.username);
        const user = await Users.findOne({
            where: {username: req.body.username}
        })
        if (!user) return res.status(404).json({ message: "User not found" });
        const email = user.email;
        const name = user.name;
        const id = user.id;
        const token = usePasswordHashToMakeToken(user);
        sendemail(email, id, name, token)
        res.status(200).json({message: "email sent"});
    } catch (error) {
        res.status(400).json({message: error.message});
    }
}

export const newPassword = async (req, res) => {
    try {
        const {id, token} = req.params;
        const newPassword = req.body.newPassword;
        const confNewPassword = req.body.confNewPassword;
        if (newPassword !== confNewPassword) return res.status(400).json({ message: "Password and Confirm Password must be same" });
        const user = await Users.findOne({
            where: {id: id}
        })
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        const secret = user.password + "-" + user.createdAt;
        const payload = jwt.decode(token, secret)
        if (payload.id == user.id) {
            const salt = await bcrypt.genSalt();
            const hashPassword = await bcrypt.hash(newPassword, salt);
            await Users.update({ password: hashPassword}, {where: {id: id}});
            return res.status(200).json({message: "Password changed"})
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}