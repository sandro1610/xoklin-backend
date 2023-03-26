import express from "express"
import {
    getPayments,
    getPaymentById,
    createPayment,
    updatePayment,
    deletePayment,
    searchPayments
} from "../../controllers/PaymentController.js"

const paymentRouter = express.Router()

paymentRouter.get('/', getPayments)
paymentRouter.get('/:id', getPaymentById) // Id Payment
paymentRouter.get('/search/:keywords', searchPayments) // params Keywords
paymentRouter.post('/', createPayment)
paymentRouter.patch('/:id', updatePayment) // Id Payment
paymentRouter.delete('/:id', deletePayment) // Id Payment

export default paymentRouter
