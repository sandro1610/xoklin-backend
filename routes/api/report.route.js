import express from "express"
import * as reportController from "../../controllers/ReportController.js"
import {auth, checkRole, ROLES} from "../../middleware/auth.js"

const reportRouter = express.Router()

reportRouter.get('/', reportController.getOrders)

export default reportRouter
