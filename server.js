import key from "./config/key.js"
import app from "./app.js"

app.listen(key.APP_PORT, () => console.log(`Server running on ${key.APP_PORT}`))