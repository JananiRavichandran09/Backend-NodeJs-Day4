import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './Database/dbConfig.js'
import userRouter from './Router/userRouter.js'
import cookieParser from 'cookie-parser'

dotenv.config()
const port = process.env.PORT
const app = express()
app.use(cors({
    origin: ["https://register-login-page-wdb.netlify.app"],
    method: ["GET","POST"],
    credentials: true,
}))
app.use(express.json())
app.use(cookieParser())
connectDB()

app.use('/api/user', userRouter)

app.listen(port, () => {
    console.log("App is running in the port", port);
})


