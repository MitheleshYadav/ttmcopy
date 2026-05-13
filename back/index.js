
const connectDb  = require("./config/db");
const app = require("./utils/app");
const dotenv = require('dotenv');

dotenv.config({
  path : "./.env"
})
connectDb();
console.log(connectDb)



app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.post("/signup", (req, res) => {

   console.log(req.body);

   res.status(200).json({
      message: "Data received"
   })

})

app.listen(3000, () => {
  console.log("Server running on port 3000");
});

//connecting frinend from the backend
//setting up the cinfigration file
//setting up the database connection
//creating the model and schema for the database
//now we need to set up the app to listen the request from the frontend and send the response to the frontend