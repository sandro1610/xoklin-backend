import Orders from "../models/OrderModel.js"
import { Op, Sequelize } from "sequelize"

export const getOrders = async (req, res) => {
    try {
        const year = new Date("04-01-2023")
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10
        const offset = limit * (page - 1)
        const totalRows = await Orders.count()
        const totalPage = Math.ceil(totalRows / limit)
        const orders = await Orders.findAll({
            attributes: { exclude: ['updatedAt'] },
            where: {
                [Op.and]: [
                    Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('createdAt')), year),
                ]
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