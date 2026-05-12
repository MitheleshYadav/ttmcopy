import mongoose from "mongoose";


const connectDb = async ()=>{
    try {
        await mongoose.connect(`${process.env.mongo_url}`)
    } catch (error) {
        console.log("error :- ", error)
        process.exit(1);
    }
}