import mongoose from "mongoose"

const  signupSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    }
}, {timestamps : true })

export const Signup = mongoose.model("Signup", signupSchema)