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
  let login = req.body.login;
  let password = req.body.password;
  let email_regex = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/;
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
