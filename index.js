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

const fetchAllUsers = async () => {
  try {
    const data = await User.find();
    return data;
  } catch (err) {
    console.log(err);
  }
};

// fetchAllUsers()
//   .then((data) => console.log(data))
//   .catch((err) => console.error(err));
let currentUser = "";
app.post("/auth/login", async (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  let record = await User.findOne({ email: email });

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
    //console.log(currentUser)
    res.redirect("/dashboard");
  }
  app.post("/error", async (req, res) => {
    email = "";
    password = "";
    record = "";
    currentUser = "";

    req.session.destroy((err) => {
      if (err) {
        return console.log(err);
      } else {
        res.redirect("/");
      }
    });
  });
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

const PORT = process.env.PORT ? process.env.PORT : 3000;
app.listen(PORT, () => {
  console.log("Your app is listening on port " + PORT);
});
