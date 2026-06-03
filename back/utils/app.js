const express = require("express");
const app = express();
const cors = require("cors");
const cookies = require("cookie-parser");


app.use(cors());  //used to connect frontend and backend
// used to parse the incoming request body in JSON format and make it available in req.body. 
app.use(express.json()); 
// used to parse the incoming request body in URL-encoded format and make it available in req.body.
app.use(express.urlencoded({ extended: true }));
// used to parse the cookies attached to the client request object and make them available in req.cookies.
app.use(cookies());
// used to serve static files such as images, CSS files, and JavaScript files from the "public" directory. 
app.use(express.static("public"));      

module.exports = app;

