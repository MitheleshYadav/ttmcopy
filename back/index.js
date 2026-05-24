const connectDb = require("./config/db");
const Location = require("./models/Location");
const User = require("./models/User");
const { connect } = require("mongoose");

const app = require("./utils/app");

const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const authenticateToken = require("./middlewares/auth");

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
    console.log("query", query);
    const isMatch = await bcrypt.compare(password, query.password);
    if (isMatch) {
      await Location.updateOne({ user_id: query._id }, { $set: { latitude: req.body.latitude, longitude: req.body.longitude , isOnline: true } });
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
    res
      .status(201)
      .json({
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
      {},
      {
        latitude: 1,
        longitude: 1,
        _id: 0,
      }
    ).populate("user_id");
    console.log("locations", locations);

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
    await Location.updateOne({ user_id: req.user.userId }, { $set: { isOnline: false } });
    res.status(200).json({ message: "Logout successful" });
  }catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server error",
    });
  }
});

//--------------------  SERVER LISTEN  --------------------//

app.listen(3000, "0.0.0.0", () => {
  console.log("Server running");
});

//connecting frontend from the backend
//setting up the cinfigration file
//setting up the database connection
//creating the model and schema for the database
//now we need to set up the app to listen the request from the frontend and send the response to the frontend
