import express from "express"
import * as reportController from "../../controllers/ReportController.js"
import {auth, checkRole, ROLES} from "../../middleware/auth.js"

const reportRouter = express.Router()

reportRouter.post('/order-period', auth, checkRole(ROLES.SuperAdmin), reportController.orderPerPeriod)
reportRouter.post('/total-ammount', auth, checkRole(ROLES.SuperAdmin), reportController.totalAmount)

export default reportRouter
