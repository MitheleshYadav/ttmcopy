const mongoose = require("mongoose");

const connectDb = async ()=>{
    try {
        await mongoose.connect(`${process.env.mongo_url}/mydatabase`)
        console.log("Connection done!!!!")
    } catch (error) {
        console.log("error :- ", error)
        process.exit(1);
    }
}

module.exports = connectDb;

