const connectDb = require("./config/db");
const Location = require("./models/Location.model");
const User = require("./models/User.model");
const PostData = require("./models/PostData.model");
const RequestDetails = require("./models/Request.model");
const AcceptedUsers = require("./models/Accepted.model")
const { connect } = require("mongoose");

const app = require("./utils/app");

const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const authenticateToken = require("./middlewares/auth");

//------------------ Socket Coonection ------------------------------------------//

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const auth = require("./middlewares/auth");
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

io.on("connect", (socket) => {
  console.log("User connected : ", socket.id);
});

dotenv.config({
  path: "./.env",
});

connectDb();

//--------------------  MIDDLEWARES  --------------------//

async function hashPassword(req, res, next) {
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(
      req.body.user_password,
      saltRounds,
    );
    req.body.user_password = hashedPassword;
    next();
  } catch (err) {
    console.error(err);
  }
}

async function userExists(req, res, next) {
  try {
    const query = await User.findOne({
      email: req.body.user_email,
    });
    if (query) {
      next();
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    console.error(err);
  }
}

//--------------------  LOGIN API  --------------------//

app.post("/login", userExists, async (req, res) => {
  try {
    const password = req.body.user_password;
    const email = req.body.user_email;
    const query = await User.findOne({
      email: email,
    });
    const isMatch = await bcrypt.compare(password, query.password);
    if (isMatch) {
      await Location.updateOne(
        { user_id: query._id },
        {
          $set: {
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            isOnline: true,
          },
        },
      );
      const token = jwt.sign(
        { userId: query._id, username: query.name },
        process.env.JWT_SECRET,
        { expiresIn: "7d" },
      );
      res.json({
        message: "Login successful",
        token: token,
        username: query.name,
      });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (err) {
    console.error(err);
  }
});

//--------------------  SIGNUP API  --------------------//

app.post("/signup", hashPassword, async (req, res) => {
  try {
    const { user_name, user_email, user_password } = req.body;
    const newUser = new User({
      name: user_name,
      email: user_email,
      password: user_password,
    });
    await newUser.save();
    const newLocation = new Location({
      user_id: newUser._id,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      isOnline: true,
    });
    await newLocation.save();
    const token = jwt.sign(
      { userId: newUser._id, username: newUser.name },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );
    res.status(201).json({
      message: "User created successfully",
      token: token,
      username: newUser.name,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//--------------------  LOCATION API  --------------------//

app.get("/location", authenticateToken, async (req, res) => {
  try {
    const locations = await Location.find(
      { isOnline: true },
      {
        latitude: 1,
        longitude: 1,
        user_id: 1,
        _id: 0,
      },
    ).populate("user_id", "name");
    // console.log("locations areeeeeeee:-     ", locations);

    res.status(200).json({ locations });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Server error",
    });
  }
});

//--------------------  LOGOUT API  --------------------//

app.get("/location/logout", authenticateToken, async (req, res) => {
  try {
    await Location.updateOne(
      { user_id: req.user.userId },
      { $set: { isOnline: false } },
    );
    res.status(200).json({ message: "Logout successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server error",
    });
  }
});

//----------------------------  DETAILS API  --------------------//

app.post("/details", authenticateToken, async (req, res) => {
  try {
    const profile_name = req.body.profile_name;
    const about = req.body.about;
    const newPost = new PostData({
      user_id: req.user.userId,
      profile_name: profile_name,
      post: about,
    });
    await newPost.save();
    res.status(201).json({
      message: "Details saved successfully",
    });
  } catch (err) {
    console.error("Error saving details:", err);
    res.status(500).json({
      message: "Server error",
    });
  }
});

//-------------------- LOCATION/POSTS API --------------------//

app.post("/location/posts", authenticateToken, async (req, res) => {
  try {
    let details;
    const user = await PostData.findOne({ user_id: req.user.userId });
    if (user) {
      // user's post already exist and he/she is trying to update the post
      details = await PostData.updateOne(
        { user_id: req.user.userId },
        { $set: { post: req.body.post } },
      );
      const updatedData = await PostData.findOne({ user_id: req.user.userId });
      console.log("emitting the updated post ", updatedData);
      io.emit("updatedpost", {
        user_id: req.user.userId,
        profile_name: updatedData.profile_name,
        post: updatedData.post,
      });
    } else {
      // user post is not in data and this is the first post of the session
      const about = req.body.post;
      const user_id = req.user.userId;
      const username = req.user.username;
      const newPost = new PostData({
        user_id: user_id,
        profile_name: username,
        post: about,
      });
      await newPost.save();
      io.emit("newpost", {
        id: user_id,
        profile_name: username,
        post: about,
      });
    }
    res.status(201).json({
      message: "Details stored succefully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server error",
    });
  }
});

//------------------- ALL EXISITING POST /Location/allexistingpost-------------------//

app.get("/location/allexistingpost", authenticateToken, async (req, res) => {
  try {
    const allPost = await PostData.find(
      {},
      {
        profile_name: 1,
        post: 1,
        user_id: 1,
        _id: 0,
      },
    );
    res.status(201).json({
      allPost,
    });
  } catch (err) {
    console.log("error in this api calling :- ", err);
    res.status(500).json({
      message: "Some issue at the backend",
    });
  }
});

//--------------------------------POST/SEND-REQUEST------------------------//

app.post("/post/send-request", authenticateToken, async (req, res) => {
  try {
    const sender_id = req.body.sender_id;
    const receiver_id = req.body.receiver_id;
    const newRequest = new RequestDetails({
      sender_id: sender_id,
      receiver_id: receiver_id,
    });
    await newRequest.save();
    res.status(201).json({
      message: "successfull",
    });
  } catch (err) {
    console.log("there is some issue : ", err);
    res.status(500);
  }
});

//---------------------------------REQUEST/PER-USER--------------------//

app.get("/request", authenticateToken, async (req, res) => {
  try {
    const current_userid = req.user.userId;
    const data = await RequestDetails.find({ receiver_id: current_userid });
    const senderIds = data.map((request) => request.sender_id);
    const posts = await PostData.find({user_id: { $in: senderIds }},{
        profile_name: 1,
        post: 1,
        user_id: 1,
        _id: 0,
      
    });
    console.log("-----------", posts);
    res.status(201).json(posts);
  } catch (err) {
    console.log("There is some error in this:", err);
    res.status(500).json({
      message: "There is some issue",
    });
  }
});

// ---------------------REQUEST/ACCPETED-----------------------//

app.post("/request/accept", authenticateToken, async (req, res)=>{
  try{
    const accepted_userid = req.body.senderID;
    const senderName = req.body.senderName;
    const newAccepted = new AcceptedUsers({
      accepted_userid : accepted_userid,
      acceptedUser_name : senderName
    })
    console.log(newAccepted);
    await newAccepted.save()
    console.log("------------------------", req.body)
    const deletedRecord = await RequestDetails.findOneAndDelete({ sender_id: req.body.senderID , receiver_id : req.body.receiverId});
    console.log("delete-----", deletedRecord);
    res.status(201).json({
      message: "Done"
    })

  }catch(err){
    console.log("There is some issue with this: ", err)
    res.status(500);
  }
})

//--------------------  SERVER LISTEN  --------------------//

server.listen(3000, "0.0.0.0", () => {
  console.log("Server running");
});

//connecting frontend from the backend
//setting up the cinfigration file
//setting up the database connection
//creating the model and schema for the database
//now we need to set up the app to listen the request from the frontend and send the response to the frontend
