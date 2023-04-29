import express from "express"
import * as orderController from "../../controllers/OrderController.js"
import {checkRole, ROLES} from "../../middleware/auth.js"

const orderRouter = express.Router()

orderRouter.get('/', orderController.getOrders)
orderRouter.get('/:id', orderController.getOrderById) // Id Order
orderRouter.get('/search/:keywords', orderController.searchOrders) // params Keywords
orderRouter.post('/', orderController.createOrder)
orderRouter.patch('/:id', orderController.changeStatusOrder) // Id Order
orderRouter.delete('/:id', orderController.deleteOrder) // Id Order

export default orderRouter
