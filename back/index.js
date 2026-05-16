
const connectDb  = require("./config/db");
const app = require("./utils/app");
const dotenv = require('dotenv');
const Signup = require("./models/Signup");

dotenv.config({
  path : "./.env"
})


async function connectionMade(req, res, next){
  await connectDb();
  console.log("Connection made!!!")
  next();
}       

app.post("/signup", connectionMade, async(req, res) => {
  try {

    const { user_name, user_email, user_password } = req.body;
    const newUser = new Signup({
      name: user_name,
      email: user_email,
      password: user_password,
    });
    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Internal server error" });
  } 

})




app.listen(3000, () => {
  console.log("Server running on port 3000");
});

//connecting frinend from the backend
//setting up the cinfigration file
//setting up the database connection
//creating the model and schema for the database
//now we need to set up the app to listen the request from the frontend and send the response to the frontend