import express from "express";
import * as authController from "../../controllers/AuthController.js";
import { auth } from "../../middleware/auth.js";

const authRouter = express.Router();

authRouter.post('/login', authController.login);
authRouter.post('/register', authController.register);
authRouter.post('/forgetPassword', authController.forgetPassword);
authRouter.patch('/newPassword/:id/:token', authController.newPassword);
authRouter.get('/me', auth, authController.me);

export default authRouter;