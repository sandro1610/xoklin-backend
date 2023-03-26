import express from "express"
import {
    getItems,
    getItemById,
    createItem,
    updateItem,
    deleteItem,
    searchItems
} from "../../controllers/ItemController.js"

const itemRouter = express.Router()

itemRouter.get('/', getItems)
itemRouter.get('/:id', getItemById) // Id Item
itemRouter.get('/search/:keywords', searchItems) // params Keywords
itemRouter.post('/', createItem)
itemRouter.patch('/:id', updateItem) // Id Item
itemRouter.delete('/:id', deleteItem) // Id Item

export default itemRouter
