import Users from "../models/UserModel.js"
import bcrypt from "bcrypt"
import {Op} from "sequelize"
import sequelize from "sequelize"

export const getUsers = async(req, res) =>{
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const offset = limit * (page-1)
    const totalRows = await Users.count()
    const totalPage = Math.ceil(totalRows / limit)
    try {
        const users = await Users.findAll({
            attributes: {exclude: ['createdAt', 'updatedAt', 'password']},
            offset: offset,
            limit: limit,
        })
        res.status(200).json({ 
            data:users,
            page: page,
            limit: limit,
            totalRows: totalRows,
            totalPage: totalPage })
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

export const getUserById = async(req, res) =>{
    try {
        const user = await Users.findOne({
            attributes: {exclude: ['createdAt', 'password']},
            where: {
                idUser: req.params.id
            }
        })
        if (user === null) return res.status(404).json({message: "User not found"})
        res.status(200).json({data: user})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

export const searchUsers = async(req, res) =>{
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const keywords = req.params.keywords
    const offset = limit * (page - 1)
    const totalRows = await Users.count({
        where: sequelize.where(sequelize.col('fullname'), {
            [Op.iRegexp]: `${keywords}`
        })}) 
    if (totalRows == 0) {
       return res.status(404).json({massage: "User not found"})
    }
    const totalPage = Math.ceil(totalRows / limit)
    try {
        const response = await Users.findAll({
            attributes: {exclude: ['createdAt', 'password']},
            order: [
                ['updatedAt', 'DESC']
            ],
            offset: offset,
            limit: limit,
            where: sequelize.where(sequelize.col('fullname'), {
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

export const createUser = async (req, res) => {
    try {
        const email = req.body.email
        const role = "ROLE_USER"
        const fullname = req.body.fullname
        const username = req.body.username
        const phone = req.body.phone
        const password = req.body.password
        const confPassword = req.body.confPassword
        const checkEmailExists = await Users.findOne({where: {[Op.or] : [{email: email}, {username: username}] }})
        // Validate Request
        if (checkEmailExists) return res.status(400).json({message: "Email has been used"})
        if (password !== confPassword) return res.status(400).json({ message: "Password and Confirm Password must be same" })
        // Hashing Password
        const salt = await bcrypt.genSalt()
        const hashPassword = await bcrypt.hash(password, salt)
        // Execute request
        await Users.create({ 
            fullname: fullname,
            email : email,
            role : role,
            username : username,
            phone : phone,
            password : hashPassword
        })
        // Response
        res.status(200).json({ message: "User created successfully" })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

export const changePassword = async (req, res) => {
    try {
        const oldPassword = req.body.oldPassword
        const newPassword = req.body.newPassword
        const confNewPassword = req.body.confNewPassword
        if (newPassword !== confNewPassword) return res.status(400).json({ message: "Password and Confirm Password Must be Same" })
        const user = await Users.findOne({
            where: {id: req.idUser}
        })
        if (!user) {
            return res.status(400).json({ message: "User Not Found" })
        }
        const isMatch = await bcrypt.compare(oldPassword, user.password)
        if (!isMatch) return  res.status(400).json({ message: "Wrong Password" })
        const salt = await bcrypt.genSalt()
        const hashPassword = await bcrypt.hash(newPassword, salt)
        await Users.update({ password: hashPassword}, {where: {id: req.idUser}})
        res.status(200).json({ message: "Password Changed" })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

export const resetPassword = async (req, res) => {
        const user = await Users.findOne({
            where: {
                id: req.params.id
            }
        })
        if (!user) return res.status(404).json({ message: 'User not found' })
        const password = "12345678"
        const salt = await bcrypt.genSalt()
        const hashPassword = await bcrypt.hash(password, salt)
        try {
            await Users.update({ password: hashPassword }, {
                where: {
                    id: req.params.id
                }
            })
            res.status(200).json({ message: "Password changed" })
        } catch (error) {
            res.status(400).json({ message: error.message })
        }
}

export const updateUser = async (req, res) => {
    const user = await Users.findOne({
        where: {
            idUser: req.params.id
        }
    })
    if (!user) return res.status(404).json({ message: 'User not found' })
    const fullname = req.body.fullname || user.fullname
    const email = req.body.email || user.email
    const username = req.body.username || user.username
    const phone = req.body.phone || user.phone
    const role = req.body.role || user.role
    try {
        await Users.update({ 
                    fullname: fullname,
                    email: email,
                    phone: phone,
                    username: username,
                    role: role }, {
            where: {
                idUser: req.params.id
            }
        })
        res.status(200).json({ message: "User Updated Successfuly" })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

export const deleteUser = async (req, res) => {
    const user = await Users.findOne({
        attributes: ['idUser'],
        where: {
            idUser: req.params.id
        }
    })
    if (!user) return res.status(404).json({ message: 'User not found' })

    try {
        await Users.destroy({
            where: {
                idUser: req.params.id
            }
        })
        res.status(200).json({ message: "User Deleted Successfuly" })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}
