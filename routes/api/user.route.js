import express from "express"
import {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    changePassword,
    resetPassword,
    searchUsers
} from "../../controllers/UserController.js"

const userRouter = express.Router()

userRouter.get('/', getUsers)
userRouter.get('/:id', getUserById) // Id User
userRouter.get('/search/:keywords', searchUsers) // params Keywords
userRouter.post('/', createUser)
userRouter.patch('/change-password', changePassword)
userRouter.patch('/:id', updateUser) // Id User
userRouter.patch('/reset-password/:id', resetPassword) // Id User
userRouter.delete('/:id', deleteUser) // Id User

export default userRouter
