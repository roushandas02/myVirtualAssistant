import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    assistantName:{
        type: String
    },
    assistantImage:{
        type: String
    },
    history: [
        {type: String}
    ]
},{timestamps: true})

// Create Model of above schema
const User=mongoose.model("User", userSchema);
export default User;