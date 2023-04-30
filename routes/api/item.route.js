import express from "express"
import * as itemController from "../../controllers/ItemController.js"
import {auth, checkRole, ROLES} from "../../middleware/auth.js"

const itemRouter = express.Router()

itemRouter.get('/', itemController.getItems)
itemRouter.get('/:id', itemController.getItemById) // Id Item
itemRouter.get('/search/:keywords', itemController.searchItems) // params Keywords
itemRouter.post('/', itemController.createItem)
itemRouter.patch('/:id', checkRole(ROLES.SuperAdmin), itemController.updateItem) // Id Item
itemRouter.delete('/:id', checkRole(ROLES.SuperAdmin), itemController.deleteItem) // Id Item

export default itemRouter
