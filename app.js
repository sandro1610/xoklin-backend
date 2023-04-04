import express from "express"
import cors from "cors"
import morgan from "morgan"
import key from "./config/key.js"
import apiRouter from "./routes/route.js"
import db from "./config/database.js"
import FileUpload from "express-fileupload"

// db.sync({ force: true }).catch((error) => {console.log(error)})

const app = express()

app.use(cors({
    credentials: true,
    origin: '*',
}))
app.use(express.static('public'))
app.use(express.json())
app.use(FileUpload())
app.use(morgan('tiny'))
app.use(`/${key.URL}`, apiRouter)
app.get("/", (req, res) => {
    res.status(200).json({ message: "Welome" })
})

db.authenticate().then(() => {
    console.log('Database authenticated');
}).catch(err => {
    console.error('Unable to connect to the database:', err);
});


export default app