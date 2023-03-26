import Orders from "../models/OrderModel.js"
import {Op} from "sequelize"
import sequelize from "sequelize"

export const getOrders = async(req, res) =>{
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const offset = limit * (page-1)
    const totalRows = await Orders.count()
    const totalPage = Math.ceil(totalRows / limit)
    try {
        const orders = await Orders.findAll({
            attributes: {exclude: ['createdAt']},
            offset: offset,
            limit: limit,
        })
        res.status(200).json({ 
            data: orders,
            page: page,
            limit: limit,
            totalRows: totalRows,
            totalPage: totalPage })
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

export const getOrderById = async(req, res) =>{
    try {
        const order = await Orders.findOne({
            where: {
                orderId: req.params.id
            }
        })
        if (Order === null) return res.status(404).json({message: "Order not found"})
        res.status(200).json({data: order})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

export const searchOrders = async(req, res) =>{
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const keywords = req.params.keywords
    const offset = limit * (page - 1)
    const totalRows = await Orders.count({
        where: sequelize.where(sequelize.col('Order'), {
            [Op.iRegexp]: `${keywords}`
        })}) 
    if (totalRows == 0) {
       return res.status(404).json({massage: "Order not found"})
    }
    const totalPage = Math.ceil(totalRows / limit)
    try {
        const response = await Orders.findAll({
            attributes: {exclude: ['createdAt', 'password']},
            order: [
                ['updatedAt', 'DESC']
            ],
            offset: offset,
            limit: limit,
            where: sequelize.where(sequelize.col('Order'), {
                [Op.iRegexp]: `${keywords}`
            })
        })
        res.status(200).json({
            data:response,
            page: page,
            limit: limit,
            totalRows: totalRows,
            totalPage: totalPage})
    } catch (error) {
        res.status(400).json({message: error.message})
    }
}

export const createOrder = async (req, res) => {
    try {
        const address = req.body.address
        const longtitude = req.body.longtitude
        const latitude = req.body.latitude
        const order = req.body.order
        const delivery_fee = req.body.delivery_fee
        const ammount = req.body.ammount
        const payment_method_id = req.body.payment_method_id
        const total_transfer = req.body.total_transfer
        const userId = req.body.userId
        // Execute request
        await Orders.create({ 
            address : address,
            longtitude : longtitude,
            latitude : latitude,
            order : order,
            delivery_fee : delivery_fee,
            ammount : ammount,
            total_transfer : total_transfer,
            payment_method_id : payment_method_id,
            userId : userId,
        })
        // Response
        res.status(200).json({ message: "Order created successfully" })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

export const updateOrder = async (req, res) => {
    const checkOrder = await Orders.findOne({
        where: {
            OrderId: req.params.id
        }
    })
    if (!checkOrder) return res.status(404).json({ message: 'Order not found' })
    const Order = req.body.Order
    const price = req.body.price
    const unit = req.body.unit
    try {
        await Orders.update({ 
            price: price,
            Order : Order,
            unit : unit,
        }, {
            where: {
                OrderId: req.params.id
            }
        })
        res.status(200).json({ message: "Order Updated Successfuly" })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

export const deleteOrder = async (req, res) => {
    const Order = await Orders.findOne({
        attributes: ['orderId'],
        where: {
            OrderId: req.params.id
        }
    })
    if (!Order) return res.status(404).json({ message: 'Order not found' })

    try {
        await Orders.destroy({
            where: {
                OrderId: req.params.id
            }
        })
        res.status(200).json({ message: "Order Deleted Successfuly" })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}