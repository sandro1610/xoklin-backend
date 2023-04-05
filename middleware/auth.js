import jwt from "jsonwebtoken";
import key from "../config/key.js";

export const auth = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(token == null) return res.sendStatus(401);
    try {
        jwt.verify(token, key.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if(err) return res.sendStatus(403);
            req.role = decoded.role;
            req.userId = decoded.userId;
            next();
        });
    } catch (error) {
        res.status(400).json({message: error.message});
    }
}
    
export const ROLES = {
    User: "ROLE_USER",
    Admin: "ROLE_ADMIN",
    SuperAdmin: "ROLE_SUPERADMIN",
};
export const checkRole = (...roles) => (req, res, next) => {
    if (!req.role) {
        return res.status(401).json({message: "Unauthorized"});
    }
    const hasRole = roles.find((role) => req.role === role);
    if (!hasRole) {
        return res
        .status(403).json({message: "Access Denied"});
    }
    return next();
};
