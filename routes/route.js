import express from "express"
import userRouter from "./api/user.route.js"
import itemRouter from "./api/item.route.js"
import reportRouter from "./api/report.route.js"
import orderRouter from "./api/order.route.js"
import authRouter from "./api/auth.route.js"
import {auth} from "../middleware/auth.js"

const apiRouter = express.Router()

apiRouter.use("/users", auth, userRouter)
apiRouter.use("/items", auth, itemRouter)
apiRouter.use("/report", reportRouter)
apiRouter.use("/auth", authRouter)
apiRouter.use("/orders", auth, orderRouter)

export default apiRouter
