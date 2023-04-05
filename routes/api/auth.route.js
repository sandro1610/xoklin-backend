import express from "express";
import {
    login,
    forgetPassword,
    newPassword,
    me
} from "../../controllers/AuthController.js";
import { auth } from "../../middleware/auth.js";

const authRouter = express.Router();

authRouter.post('/login', login);
authRouter.post('/forgetPassword', forgetPassword);
authRouter.patch('/newPassword/:id/:token', newPassword);
authRouter.get('/me', auth, me);

export default authRouter;