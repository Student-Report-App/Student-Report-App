const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.post("/auth/login", async (req, res) => {
  if (req.session.user) {
    res.redirect("/dashboard");
  } else {
    res.redirect("/404");
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

router.post("/auth/checkUsername", async (req, res) => {
  const { username } = req.body;
  const exists = await User.findOne({ username: username });
  res.json({ exists: exists !== null });
});

router.post("/auth/checkEmail", async (req, res) => {
  const { email } = req.body;
  const exists = await User.findOne({ email: email });
  res.json({ exists: exists !== null });
});

router.post("/auth/checkPassword", async (req, res) => {
  const { login, password, loginType, checked } = req.body;
  let record;
  if (loginType === "email") {
    record = await User.findOne({ email: login });
  } else {
    record = await User.findOne({ username: login });
  }
  if (record.password === password) {
    req.session.user = record;
    if (checked) {
      req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 30; // 1 month
    } else {
      req.session.cookie.maxAge = 1000 * 60 * 60 * 24; // 24 hours
    }
    res.json({ match: true });
  } else {
    res.json({ match: false });
  }
});

router.post("/auth/register", async (req, res) => {
  const { name, username, email, password, year, branch, roll, division } =
    req.body;
  const newUser = new User({
    name,
    username,
    email,
    password,
    year,
    branch,
    roll,
    division,
  });

  try {
    const data = await newUser.save();
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
});

router.post("/auth/updateData", async (req, res) => {
  const { name, username, email, roll, division, branch, year } = req.body;
  try {
    const user = await User.findOneAndUpdate(
      { username: req.session.user.username },
      { name, username, email, roll, division, branch, year },
      { new: true }
    );
    req.session.user = user;
    res.json({ success: true });
  } catch (error) {
    console.log(error);
    res.json({ success: false });
  }
});

module.exports = router;
