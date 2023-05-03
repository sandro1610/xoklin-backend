import express from "express"
import * as userController from "../../controllers/UserController.js"
import { checkRole, ROLES } from "../../middleware/auth.js"

const userRouter = express.Router()

userRouter.get('/', checkRole(ROLES.SuperAdmin), userController.getUsers)
userRouter.get('/:id', checkRole(ROLES.SuperAdmin), userController.getUserById) // Id User
userRouter.get('/search/:keywords', checkRole(ROLES.SuperAdmin), userController.searchUsers) // params Keywords
userRouter.post('/', userController.createUser)
userRouter.patch('/change-password', userController.changePassword)
userRouter.patch('/:id', userController.updateUser) // Id User
userRouter.patch('/reset-password/:id', checkRole(ROLES.SuperAdmin), userController.resetPassword) // Id User
userRouter.delete('/:id', checkRole(ROLES.SuperAdmin), userController.deleteUser) // Id User

export default userRouter
