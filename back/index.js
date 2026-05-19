
const connectDb  = require("./config/db");
const app = require("./utils/app");
const dotenv = require('dotenv');
const User = require("./models/User");
const { connect } = require("mongoose");

dotenv.config({
  path : "./.env"
})

connectDb();
   

async function userExists(req, res, next){
  try{
     const query =  await User.findOne({
      email : req.body.user_email
     })
     if(query){
       next();
     } else {
       res.status(404).json({ message: "User not found" });
     }
   }catch(err){
    console.error(err);
   }
   
}

app.post("/login", userExists, async(req, res)=>{
      try{
        const password = req.body.user_password;
        const email = req.body.user_email;
        const query = await User.findOne({
          email : email
        })
        console.log(query);
        console.log(query.name);
        if(query.password === password){
          res.status(201).json({ message: "Login successful", username: query.name });
        }else{
          res.status(401).json({ message: "Invalid password" });
        }
      }catch(err){
        console.error(err);
      }
})

app.post("/signup", async(req, res) => {
  try {
    const { user_name, user_email, user_password } = req.body;
    const newUser = new User({
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