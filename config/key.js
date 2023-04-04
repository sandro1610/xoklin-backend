import dotenv from "dotenv"
dotenv.config()

const key = {
    APP_PORT : process.env.APP_PORT,
    URL : process.env.URL,
    ACCESS_TOKEN_SECRET : process.env.ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET : process.env.REFRESH_TOKEN_SECRET,
    DB_URI : process.env.DB_URI,
    
    // Database
    HOST : process.env.HOST,
    UNAME : process.env.UNAME,
    PASSWORD : process.env.PASSWORD,
    DATABASE : process.env.DATABASE,
    DIALECT : process.env.DIALECT,
    
    // Email
    EMAIL_PORT : process.env.EMAIL_PORT,
    EMAIL_HOST : process.env.EMAIL_HOST,
    EMAIL_USERNAME : process.env.EMAIL_USERNAME,
    EMAIL_PASSWORD : process.env.EMAIL_PASSWORD,
}

export default key
    