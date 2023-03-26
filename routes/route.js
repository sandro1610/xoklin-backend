import express from "express"
import userRouter from "./api/user.route.js"
import itemRouter from "./api/item.route.js"
import paymentRouter from "./api/payment.route.js"
import orderRouter from "./api/order.route.js"

const apiRouter = express.Router()

apiRouter.use("/users", userRouter)
apiRouter.use("/items", itemRouter)
apiRouter.use("/payments", paymentRouter)
apiRouter.use("/orders", orderRouter)

export default apiRouter
