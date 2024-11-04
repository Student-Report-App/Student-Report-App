require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  if (currentUser) {
    res.redirect("/dashboard");
  } else {
    res.sendFile(__dirname + "/views/index.html");
  }
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not Connect to the database", err));

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

let currentUser = "";
app.post("/auth/login", async (req, res) => {
  const login = req.body.login;
  const password = req.body.password;
  const email_regex = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/;
  let record;
  if (login.match(email_regex)) {
    record = await User.findOne({ email: login });
  } else {
    record = await User.findOne({ username: login });
  }

  if (record === null) {
    console.log("Invalid Username");
    currentUser = "";
    res.redirect("/error");
  } else if (password !== record.password) {
    console.log("Invalid Password");
    currentUser = "";
    res.redirect("/error");
  } else {
    console.log("Authenticated");
    currentUser = record.username;
    res.redirect("/dashboard");
  }
});

app.get("/error", (req, res) => {
  res.sendFile(__dirname + "/views/error.html");
});

app.get("/dashboard", (req, res) => {
  if (currentUser) {
    res.sendFile(__dirname + "/views/dashboard.html");
  } else {
    res.redirect("/error");
  }
});

app.get("/register", (req, res) => {
  res.sendFile(__dirname + "/views/register.html");
});

app.post("/auth/register", async (req, res) => {
  if (await User.findOne({ email: req.body.email })) {
    res.send("Email already registered");
  } else if (await User.findOne({ username: req.body.username })) {
    res.send("Username already taken");
  } else {
    const newUser = new User({
      name: req.body.name,
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      year: req.body.year,
      branch: req.body.branch,
    });
    try {
      const data = await newUser.save();
      console.log("New User Registered with the following details:");
      console.log(data)
    } catch (error) {
      console.log(error);
    }
    res.redirect("/");
  }
});

app.get("/404", (req, res) => {
  res.sendFile(__dirname + "/views/404.html");
});

// Catch-all route handler for undefined routes
app.use((req, res) => {
  res.redirect("/404");
});

const PORT = process.env.PORT ? process.env.PORT : 3000;
app.listen(PORT, () => {
  console.log("Your app is listening on port " + PORT);
});
