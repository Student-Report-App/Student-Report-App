require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require("express-session");
const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret: process.env.SESSION_SECRET || 'test',  // Secret key for session encryption
  resave: false,
  saveUninitialized: true,
  cookie: { 
    secure: false,  
    maxAge: 1000 * 60 * 60 * 24,  //for 24 hours
    sameSite: 'strict'  
  }
}));


mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to the database", err));


const userSchema = new mongoose.Schema(
  {
    name: String,
    username: String,
    email: String,
    password: String,
    year: String,
    branch: String,
  },
  { versionKey: false, collection: "Users" }
);

const User = mongoose.model("User", userSchema);

app.get("/", (req, res) => {
  if (req.session.user) {
    res.redirect("/dashboard");
  } else {
    res.sendFile(__dirname + "/views/index.html");
  }
});

app.post("/auth/login", async (req, res) => {
  const { login, password } = req.body;
  const emailRegex = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/;
  let record;

  if (login.match(emailRegex)) {
    record = await User.findOne({ email: login });
  } else {
    record = await User.findOne({ username: login });
  }

  if (record === null) {
    console.log("Invalid Username");
    res.redirect("/error");
  } else if (password !== record.password) {
    console.log("Invalid Password");
    res.redirect("/error");
  } else {

    console.log("Authenticated");
    req.session.user = { username: record.username };  // Store user in session
    res.redirect("/dashboard");
  }
});

app.post("/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).send("Failed to destroy session");
      }
    res.clearCookie('connect.sid');
  res.redirect("/");
  });

})
app.get("/error", (req, res) => {
  res.sendFile(__dirname + "/views/error.html");
});


app.get("/dashboard", (req, res) => {
  if (req.session.user) {
    res.sendFile(__dirname + "/views/dashboard.html");
  } else {
    res.redirect("/error");
  }
});

app.get("/register", (req, res) => {
  res.sendFile(__dirname + "/views/register.html");
});

app.post("/auth/register", async (req, res) => {
  const { name, username, email, password, year, branch } = req.body;

  if (await User.findOne({ email })) {
    return res.send("Email already registered");
  } else if (await User.findOne({ username })) {
    return res.send("Username already taken");
  } else {

    const newUser = new User({
      name,
      username,
      email,
      password,
      year,
      branch,
    });

    try {
      const data = await newUser.save();
      console.log("New User Registered with the following details:");
      console.log(data);
      res.redirect("/");  
    } catch (error) {
      console.log(error);
    }
  }
});

app.get("/404", (req, res) => {
  res.sendFile(__dirname + "/views/404.html");
});

// Catch-all route handler for undefined routes
app.use((req, res) => {
  res.redirect("/404");
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Your app is listening on port ${PORT}`);
});
