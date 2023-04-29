import express from "express"
import userRouter from "./api/user.route.js"
import itemRouter from "./api/item.route.js"
import orderRouter from "./api/order.route.js"
import authRouter from "./api/auth.route.js"
import {auth, checkRole, ROLES} from "../middleware/auth.js"

const apiRouter = express.Router()

apiRouter.use("/users", userRouter)
apiRouter.use("/items", auth, itemRouter)
apiRouter.use("/auth", authRouter)
apiRouter.use("/orders", auth, orderRouter)

export default apiRouter
