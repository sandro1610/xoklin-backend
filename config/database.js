import { Sequelize } from "sequelize"
import key from "./key.js"
const db = new Sequelize(key.DATABASE, key.UNAME, `${key.PASSWORD}`, {
    host: key.HOST,
    dialect: key.DIALECT
})

export default db
