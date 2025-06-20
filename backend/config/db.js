import mongoose from "mongoose"
// import dotenv from "dotenv";
// dotenv.config()

const connectDB=async ()=>{
    try {
        // console.log(process.env.DEMO_URL)
        await mongoose.connect(process.env.MONGODB_URL)
        console.log("Database Connected Successfully");
    } catch (error) {
        console.log("Error Connecting to Database",error)
    }
}

export default connectDB