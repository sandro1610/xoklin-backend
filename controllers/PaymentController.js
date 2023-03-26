import Payments from "../models/PaymentModel.js"
import { Op } from "sequelize"
import sequelize from "sequelize"
import path from 'path'
import fs from 'fs'

export const getPayments = async (req, res) => {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const offset = limit * (page - 1)
    const totalRows = await Payments.count()
    const totalPage = Math.ceil(totalRows / limit)
    try {
        const payments = await Payments.findAll({
            attributes: { exclude: ['createdAt', 'updatedAt'] },
            offset: offset,
            limit: limit,
        })
        res.status(200).json({
            data: payments,
            page: page,
            limit: limit,
            totalRows: totalRows,
            totalPage: totalPage
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const getPaymentById = async (req, res) => {
    try {
        const payment = await Payments.findOne({
            attributes: { exclude: ['createdAt'] },
            where: {
                idPayment: req.params.id
            }
        })
        if (payment === null) return res.status(404).json({ message: "Payment not found" })
        res.status(200).json({ data: payment })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const searchPayments = async (req, res) => {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const keywords = req.params.keywords
    const offset = limit * (page - 1)
    const totalRows = await Payments.count({
        where: sequelize.where(sequelize.col('bank'), {
            [Op.iRegexp]: `${keywords}`
        })
    })
    if (totalRows == 0) {
        return res.status(404).json({ massage: "Payment not found" })
    }
    const totalPage = Math.ceil(totalRows / limit)
    try {
        const response = await Payments.findAll({
            attributes: { exclude: ['createdAt', 'password'] },
            order: [
                ['updatedAt', 'DESC']
            ],
            offset: offset,
            limit: limit,
            where: sequelize.where(sequelize.col('bank'), {
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

export const createPayment = async (req, res) => {
    if (req.files === null) return res.status(400).json({ message: "No File Uploaded" });
    try {
        const bank = req.body.bank
        const account = req.body.account
        const file = req.files.file;
        const fileSize = file.data.length;
        const ext = path.extname(file.name);
        const fileName = file.md5 + Date.now() + ext;
        const url = `/images/icon/${fileName}`;
        // Validating request
        const allowedType = ['.png', '.jpg', '.jpeg'];
        if (!allowedType.includes(ext.toLowerCase())) return res.status(422).json({ message: "Invalid Images" });
        if (fileSize > 2000000) return res.status(422).json({ message: "Image must be less than 2 MB" });
        const dir = "./public/images/icon/"
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, {recursive: true});
        }
        // Execute request
        file.mv(`${dir}${fileName}`, async (err) => {
            if (err) return res.status(400).json({ message: err.message });
            try {
                await Payments.create({
                    bank: bank,
                    account: account,
                    icon: fileName,
                    iconUrl: url,
                })
                res.status(200).json({ message: "Payment Created Successfuly" });
            } catch (error) {
                res.status(400).json({ message: error.message });
            }
        })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

export const updatePayment = async (req, res) => {
    const checkPayment = await Payments.findOne({
        where: {
            idPayment: req.params.id
        }
    })
    if (!checkPayment) return res.status(404).json({ message: 'Payment not found' })
    let fileName = "";
    if (req.files === null) {
        fileName = checkPayment.icon;
    } else {
        const file = req.files.file;
        const fileSize = file.data.length;
        const ext = path.extname(file.name);
        fileName = file.md5 + Date.now() + ext;
        const allowedType = ['.png', '.jpg', '.jpeg', '.svg'];

        if (!allowedType.includes(ext.toLowerCase())) return res.status(422).json({ message: "Invalid Images" });
        if (fileSize > 2000000) return res.status(422).json({ message: "Image must be less than 2 MB" });

        const filepath = `./public/images/icon/${checkPayment.icon}`;
        if (fs.existsSync(filepath)) {
            fs.unlinkSync(filepath);
        }

        file.mv(`./public/images/icon/${fileName}`, (err) => {
            if (err) return res.status(400).json({ message: err.message });
        });
    }
    const bank = req.body.bank
    const account = req.body.account
    const url = `/images/icon/${fileName}`;
    try {
        await Payments.update({
            bank: bank,
            account: account,
            icon: fileName,
            iconUrl: url,
        }, {
            where: {
                idPayment: req.params.id
            }
        })
        res.status(200).json({ message: "Payment Updated Successfuly" })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

export const deletePayment = async (req, res) => {
    const payment = await Payments.findOne({
        attributes: ['idPayment', 'icon'],
        where: {
            idPayment: req.params.id
        }
    })
    if (!payment) return res.status(404).json({ message: 'Payment not found' })

    try {
        const filepath = `./public/images/icon/${payment.icon}`;
        if (fs.existsSync(filepath)) {
            fs.unlinkSync(filepath);
        }
        await Payments.destroy({
            where: {
                idPayment: req.params.id
            }
        })
        res.status(200).json({ message: "Payment Deleted Successfuly" })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}