import Orders from "../models/OrderModel.js"
import { Op } from "sequelize"
import sequelize from "sequelize"
import Users from "../models/UserModel.js"

export const getOrders = async (req, res) => {
    try {
        const role = req.role
        const status = req.query.status
        var condition
        if(role == "ROLE_USER"){
            if (status == "cancel"){
                condition = {status : 0, userId : req.userId}
            } else if (status == "ongoing"){
                condition = {status : [1,2,3,4,5], userId : req.userId}
            } else if (status == "completed"){
                condition = {status : 6, userId : req.userId}
            } else{
                condition = {userId : req.userId}
            }
        } else if (role == "ROLE_SUPERADMIN"){
            if (status == "cancel"){
                condition = {status : 0}
            } else if (status == "ongoing"){
                condition = {status : [1,2,3,4,5]}
            } else if (status == "completed"){
                condition = {status : 6}
            } else{
                condition = sequelize.where(sequelize.col('Orders.idOrder'), sequelize.col('Orders.idOrder'))
            }
        } else if (role == "ROLE_ADMIN"){
            if (status == "cancel"){
                condition = {status : 0}
            } else if (status == "ongoing"){
                condition = {status : [1,2,3,4,5]}
            } else if (status == "completed"){
                condition = {status : 6}
            } else{
                condition = sequelize.where(sequelize.col('Orders.idOrder'), sequelize.col('Orders.idOrder'))
            }
        } else{
            return res.status(403).json({message : "Access Denied"})
        }
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10
        const offset = limit * (page - 1)
        const totalRows = await Orders.count({where: condition})
        const totalPage = Math.ceil(totalRows / limit)
        const orders = await Orders.findAll({
            attributes: { exclude: ['createdAt'] },
            include : [{model: Users, attributes: {exclude: ["password", "username", "createdAt", "updatedAt", "role"]}}],
            where : condition,
            offset: offset,
            order: [["createdAt", 'desc']],
            limit: limit,
        })
        res.status(200).json({
            data: orders,
            page: page,
            limit: limit,
            totalRows: totalRows,
            totalPage: totalPage
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const getOrderById = async (req, res) => {
    try {
        const idOrder = req.params.id
        const order = await Orders.findOne({
            where: {
                idOrder: idOrder
            }
        })
        if (order === null) return res.status(404).json({ message: "Order not found" })
        res.status(200).json({ data: order })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const searchOrders = async (req, res) => {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const keywords = req.params.keywords
    const offset = limit * (page - 1)
    const totalRows = await Orders.count({
        where: sequelize.where(sequelize.col('Order'), {
            [Op.iRegexp]: `${keywords}`
        })
    })
    if (totalRows == 0) {
        return res.status(404).json({ massage: "Order not found" })
    }
    const totalPage = Math.ceil(totalRows / limit)
    try {
        const response = await Orders.findAll({
            attributes: { exclude: ['createdAt', 'password'] },
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
            data: response,
            page: page,
            limit: limit,
            totalRows: totalRows,
            totalPage: totalPage
        })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

export const createOrder = async (req, res) => {
    try {
        const address = req.body.address
        const longtitude = req.body.longtitude
        const latitude = req.body.latitude
        const order = req.body.order
        const ammount = req.body.ammount
        const userId = req.body.userId
        // Execute request
        await Orders.create({
            address: address,
            longtitude: longtitude,
            latitude: latitude,
            order: order,
            ammount: ammount,
            userId: userId,
        })
        // Response
        res.status(200).json({ message: "Order created successfully" })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}


export const changeStatusOrder = async (req, res) => {
    const idOrder = req.params.id
    const checkOrder = await Orders.findOne({
        where: {
            idOrder: idOrder
        }
    })
    if (!checkOrder) return res.status(404).json({ message: 'Order not found' })
    const status = req.body.status
    try {
        await Orders.update({
            status: status,
        }, {
            where: {
                idOrder: idOrder
            }
        })
        res.status(200).json({ message: "Order Status Changed" })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

export const deleteOrder = async (req, res) => {
    const idOrder = req.params.id
    const Order = await Orders.findOne({
        attributes: ['idOrder'],
        where: {
            idOrder: idOrder
        }
    })
    if (!Order) return res.status(404).json({ message: 'Order not found' })

    try {
        await Orders.destroy({
            where: {
                idOrder: idOrder
            }
        })
        res.status(200).json({ message: "Order Deleted Successfuly" })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}