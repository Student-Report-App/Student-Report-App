const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Announcement = require("../models/Announcement");
const SecretKey = require("../models/SecretKey");
const path = require("path");
const argon2 = require("argon2");

router.post("/auth/login", async (req, res) => {
  if (req.session.user) {
    res.redirect("/dashboard");
  } else {
    res.sendFile(path.join(__dirname, "/../views/404.html"));
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
  const exists = await User.findOne({ username });
  res.json({ exists: exists !== null });
});

router.post("/auth/checkEmail", async (req, res) => {
  const { email } = req.body;
  const exists = await User.findOne({ email });
  res.json({ exists: exists !== null });
});

router.post("/auth/checkPassword", async (req, res) => {
  const { login, password, loginType, checked } = req.body;
  const query = loginType === "Email" ? { email: login } : { username: login };
  const record = await User.findOne(query);
  if (record && (await argon2.verify(record.password, password))) {
    req.session.user = record;
    req.session.cookie.maxAge = checked
      ? 1000 * 60 * 60 * 24 * 30
      : 1000 * 60 * 60 * 24;
    res.json({ match: true });
  } else {
    res.json({ match: false });
  }
});

router.post("/auth/changePassword", async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (await argon2.verify(req.session.user.password, oldPassword)) {
    try {
      const hashedPassword = await argon2.hash(newPassword);
      const user = await User.findOneAndUpdate(
        { username: req.session.user.username },
        { password: hashedPassword },
        { new: true },
      );
      req.session.user = user;
      res.json({ success: true });
    } catch (error) {
      console.log(error);
      res.json({ success: false });
    }
  } else {
    res.json({ success: false });
  }
});

router.post("/auth/register", async (req, res) => {
  const { name, username, email, password, year, branch, roll, division } =
    req.body;
  const hashedPassword = await argon2.hash(password);
  const newUser = new User({
    name,
    username,
    email,
    password: hashedPassword,
    year,
    branch,
    roll,
    division,
  });
  try {
    await newUser.save();
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
      { new: true },
    );
    req.session.user = user;
    res.json({ success: true });
  } catch (error) {
    console.log(error);
    res.json({ success: false });
  }
});

router.post("/api/secretKey", async (req, res) => {
  const { secretKey } = req.body;
  realKey = await SecretKey.findOne();
  if (secretKey == realKey.value) {
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

router.post("/api/announcements", async (req, res) => {
  const { announcement, dueDate, checkedValues } = req.body;
  checkedValues.forEach(async (value) => {
    const newAnnouncement = new Announcement({
      for: value,
      name: announcement,
      at: new Date(new Date(dueDate).getTime()),
    });
    try {
      await newAnnouncement.save();
    } catch (error) {
      console.error("Error saving announcement:", error);
      res.json({ success: false, error: error });
    }
  });
  res.json({ success: true });
});

module.exports = router;
