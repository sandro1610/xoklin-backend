import express from "express"
import {
    getOrders,
    getOrderById,
    createOrder,
    updateOrder,
    deleteOrder,
    searchOrders
} from "../../controllers/OrderController.js"

const orderRouter = express.Router()

orderRouter.get('/', getOrders)
orderRouter.get('/:id', getOrderById) // Id Order
orderRouter.get('/search/:keywords', searchOrders) // params Keywords
orderRouter.post('/', createOrder)
orderRouter.patch('/:id', updateOrder) // Id Order
orderRouter.delete('/:id', deleteOrder) // Id Order

export default orderRouter
