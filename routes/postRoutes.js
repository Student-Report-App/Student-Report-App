const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.post("/auth/login", async (req, res) => {
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
    req.session.user = record; // Store entire user record in session
    res.redirect("/dashboard");
  }
});

router.post("/auth/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send("Failed to destroy session");
    }
    res.clearCookie("connect.sid");
    res.redirect("/");
  });
});

router.post("/auth/register", async (req, res) => {
  const { name, username, email, password, year, branch,roll} = req.body;

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
      roll
    });

    try {
      const data = await newUser.save();
      // console.log("New User Registered with the following details:");
      // console.log(data);
      res.redirect("/");
    } catch (error) {
      console.log(error);
    }
  }
});

module.exports = router;
