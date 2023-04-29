import express from "express"
import {
    getItems,
    getItemById,
    createItem,
    updateItem,
    deleteItem,
    searchItems
} from "../../controllers/ItemController.js"
import {auth, checkRole, ROLES} from "../../middleware/auth.js"

const itemRouter = express.Router()

itemRouter.get('/', getItems)
itemRouter.get('/:id', getItemById) // Id Item
itemRouter.get('/search/:keywords', searchItems) // params Keywords
itemRouter.post('/', createItem)
itemRouter.patch('/:id', checkRole(ROLES.SuperAdmin), updateItem) // Id Item
itemRouter.delete('/:id', checkRole(ROLES.SuperAdmin), deleteItem) // Id Item

export default itemRouter
