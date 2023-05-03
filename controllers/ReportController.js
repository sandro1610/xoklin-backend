import Orders from "../models/OrderModel.js"
import { Op, Sequelize } from "sequelize"

export const orderPerPeriod = async (req, res) => {
    try {
        const start = req.body.start
        const end = req.body.end
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10
        const offset = limit * (page - 1)
        const totalRows = await Orders.count()
        const totalPage = Math.ceil(totalRows / limit)
        const orders = await Orders.findAll({
            attributes: ["ammount", "createdAt"],
            where: {
                createdAt : {
                    [Op.between] : [start, end]
                }
            },
            offset: offset,
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

export const totalAmount = async (req, res) => {
    try {
        const start = req.body.start
        const end = req.body.end
        const orders = await Orders.findOne({
            attributes: [[Sequelize.fn('SUM', Sequelize.col('ammount')), 'total_ammount']],
            where: {
                createdAt : {
                    [Op.between] : [start, end]
                }
            },
            group: [Sequelize.fn('DATE_TRUNC', 'month', Sequelize.col('createdAt'))]
        })
        res.status(200).json({
            data: orders
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}