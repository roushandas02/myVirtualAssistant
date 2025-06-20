import express from "express"
import dotenv from "dotenv"
dotenv.config()
import connectDB from "./config/db.js"
import cookieParser from "cookie-parser"
import authRouter from "./routes/auth.routes.js"
import cors from "cors"
import userRouter from "./routes/user.routes.js"



const app=express()
//Accept fetch requets from frontend url
app.use(cors({
    origin:["http://localhost:5173","https://myvirtualassistant-frontend.onrender.com"],
    credentials:true
}))
const port=process.env.PORT || 5000

//Middlewares to express as json, parse the cookies and append "/api/auth" before routes of authRoute
app.use(express.json())
app.use(cookieParser())
app.use("/api/auth",authRouter)
app.use("/api/user",userRouter)


app.listen(port, ()=>{
    //Connecting to database function called from config>db.js
    connectDB()    

    console.log("Server started on Port: ",port);
})
