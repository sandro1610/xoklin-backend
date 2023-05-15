import Items from "../models/ItemModel.js"
import {Op} from "sequelize"
import sequelize from "sequelize"
import path from "path"
import fs from "fs"

export const getItems = async(req, res) =>{
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const offset = limit * (page-1)
    const totalRows = await Items.count()
    const totalPage = Math.ceil(totalRows / limit)
    try {
        const items = await Items.findAll({
            attributes: {exclude: ['createdAt', 'updatedAt']},
            offset: offset,
            limit: limit,
        })
        res.status(200).json({ 
            data: items,
            page: page,
            limit: limit,
            totalRows: totalRows,
            totalPage: totalPage })
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

export const getItemById = async(req, res) =>{
    try {
        const item = await Items.findOne({
            attributes: {exclude: ['createdAt']},
            where: {
                idItem: req.params.id
            }
        })
        if (item === null) return res.status(404).json({message: "Item not found"})
        res.status(200).json({data: item})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

export const searchItems = async(req, res) =>{
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const keywords = req.params.keywords
    const offset = limit * (page - 1)
    const totalRows = await Items.count({
        where: sequelize.where(sequelize.col('item'), {
            [Op.iRegexp]: `${keywords}`
        })}) 
    if (totalRows == 0) {
       return res.status(404).json({massage: "Item not found"})
    }
    const totalPage = Math.ceil(totalRows / limit)
    try {
        const response = await Items.findAll({
            attributes: {exclude: ['createdAt', 'password']},
            order: [
                ['updatedAt', 'DESC']
            ],
            offset: offset,
            limit: limit,
            where: sequelize.where(sequelize.col('item'), {
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

export const createItem = async (req, res) => {
    if (req.files === null) return res.status(400).json({ message: "No File Uploaded" });
    try {
        const item = req.body.item
        const price = req.body.price
        const unit = req.body.unit
        const file = req.files.file;
        const fileSize = file.data.length;
        const ext = path.extname(file.name);
        const fileName = file.md5 + Date.now() + ext;
        const url = `/images/item/${fileName}`;
        // Validating request
        const allowedType = ['.png', '.jpg', '.jpeg'];
        if (!allowedType.includes(ext.toLowerCase())) return res.status(422).json({ message: "Invalid Images" });
        if (fileSize > 2000000) return res.status(422).json({ message: "Image must be less than 2 MB" });
        const dir = "./public/images/item/"
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, {recursive: true});
        }
        // Execute request
        file.mv(`${dir}${fileName}`, async (err) => {
            if (err) return res.status(400).json({ message: err.message });
            try {
                await Items.create({
                    item: item,
                    price: price,
                    unit: unit,
                    icon: fileName,
                    iconUrl: url,
                })
                res.status(200).json({ message: "Item Created Successfuly" });
            } catch (error) {
                res.status(400).json({ message: error.message });
            }
        })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

export const updateItem = async (req, res) => {
    const checkItem = await Items.findOne({
        where: {
            idItem: req.params.id
        }
    })
    if (!checkItem) return res.status(404).json({ message: 'Item not found' })
    let fileName = "";
    if (req.files === null) {
        fileName = checkItem.icon;
    } else {
        const file = req.files.file;
        const fileSize = file.data.length;
        const ext = path.extname(file.name);
        fileName = file.md5 + Date.now() + ext;
        const allowedType = ['.png', '.jpg', '.jpeg', '.svg'];

        if (!allowedType.includes(ext.toLowerCase())) return res.status(422).json({ message: "Invalid Images" });
        if (fileSize > 2000000) return res.status(422).json({ message: "Image must be less than 2 MB" });

        const filepath = `./public/images/icon/${checkItem.icon}`;
        if (fs.existsSync(filepath)) {
            fs.unlinkSync(filepath);
        }

        file.mv(`./public/images/icon/${fileName}`, (err) => {
            if (err) return res.status(400).json({ message: err.message });
        });
    }
    const item = req.body.item
    const price = req.body.price
    const unit = req.body.unit
    const url = `/images/icon/${fileName}`;
    try {
        await Items.update({
            item: item,
            price: price,
            unit: unit,
            icon: fileName,
            iconUrl: url,
        }, {
            where: {
                idItem: req.params.id
            }
        })
        res.status(200).json({ message: "Item Updated Successfuly" })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

export const deleteItem = async (req, res) => {
    const item = await Items.findOne({
        attributes: ['idItem', 'icon'],
        where: {
            idItem: req.params.id
        }
    })
    if (!item) return res.status(404).json({ message: 'Item not found' })

    try {
        const filepath = `./public/images/icon/${item.icon}`;
        if (fs.existsSync(filepath)) {
            fs.unlinkSync(filepath);
        }
        await Items.destroy({
            where: {
                idItem: req.params.id
            }
        })
        res.status(200).json({ message: "Item Deleted Successfuly" })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}