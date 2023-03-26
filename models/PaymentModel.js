import { Sequelize } from "sequelize"
import db from "../config/database.js"

const { DataTypes } = Sequelize

const Payments = db.define('Payments', {
    idPayment: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV1,
        unique: true,
        primaryKey: true,
        validate: {
            notEmpty: true,
        }
    }, bank: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    }, account: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    }, icon: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    }, iconUrl: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    }, is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    }
}, {
    freezeTableNames: true
})

export default Payments