import { Sequelize } from "sequelize"
import db from "../config/database.js"
import Users from "./UserModel.js"

const { DataTypes } = Sequelize

const Orders = db.define('Orders', {
    idOrder: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV1,
        unique: true,
        primaryKey: true,
        validate: {
            notEmpty: true,
        }
    }, address: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    }, longtitude: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    }, latitude: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            notEmpty: false,
        }
    }, order: {
        type: DataTypes.JSON,
        allowNull: true,
        validate: {
            notEmpty: false,
        }
    }, ammount: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
            notEmpty: false,
        }
    }, status: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    }, userId: {
        type: DataTypes.UUID,
        validate: {
            notEmpty: true,
        }
    }
}, {
    freezeTableNames: true
})

Users.hasMany(Orders, {foreignKey: 'userId'})
Orders.belongsTo(Users, {foreignKey: 'userId'})

export default Orders