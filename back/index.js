
const connectDb  = require("./config/db");
const app = require("./utils/app");
const dotenv = require('dotenv');
const User = require("./models/User");
const { connect } = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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

async function hashPassword(req, res, next){
  try{
    const plainPassword = req.body.user_password;
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
    req.body.user_password = hashedPassword;
    next();
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
        });
        const isMatch = await bcrypt.compare(password, query.password);
        console.log(isMatch);
        if(!isMatch){
          res.status(401).json({ message: "Invalid credentials" });
        } 
        const token = jwt.sign(
          {
            userId : query._id,
            username : query.name
          }, process.env.JWT_SECRET, 
          { expiresIn: "7d" }
        )
        res.status(200).json({
          message : "Login successful",
          token
        })
      }catch(err){
        console.error(err);
      }
})

app.post("/signup", hashPassword, async(req, res) => {
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