import { Sequelize } from "sequelize"
import db from "../config/database.js"
import Payments from "./PaymentModel.js"
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
    }, delivery_fee: {
        type: DataTypes.INTEGER,
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
    }, payment_method_id: {
        type: DataTypes.UUID,
        validate: {
            notEmpty: true,
        }
    }, total_transfer: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
            notEmpty: false,
        }
    }, proff: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            notEmpty: false,
        }
    }, proffUrl: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            notEmpty: false,
        }
    }, status: {
        type: DataTypes.STRING,
        defaultValue: "NEW",
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
Payments.hasMany(Orders, {foreignKey: 'itemId'})
Orders.belongsTo(Users, {foreignKey: 'userId'})
Orders.belongsTo(Payments, {foreignKey: 'itemId'})

export default Orders