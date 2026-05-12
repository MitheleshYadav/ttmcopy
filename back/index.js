const express = require("express");
const cors = require("cors");
const connectDb  = require("./db/db");
const app = express();
const dotenv = require('dotenv');

dotenv.config({
  path : "./.env"
})
connectDb();
console.log(connectDb)
app.use(express.json());
app.use(cors());
app.get("/", (req, res) => {
  res.send("Backend is running");
});


app.listen(3000, () => {
  console.log("Server running on port 3000");
});