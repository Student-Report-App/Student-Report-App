const express = require("express");
const router = express.Router();
const path = require("path");

router.get("/", (req, res) => {
  if (req.session.user) {
    res.redirect("/dashboard");
  } else {
    res.sendFile(path.join(__dirname, "/../views/index.html"));
  }
});

router.get("/dashboard", (req, res) => {
  if (req.session.user) {
    res.sendFile(path.join(__dirname, "/../views/dashboard.html"));
  } else {
    res.redirect("/404");
  }
});

router.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "/../views/register.html"));
});

router.get("/404", (req, res) => {
  res.sendFile(path.join(__dirname, "/../views/404.html"));
});

router.get("/timetable", (req, res) => {
  res.sendFile(path.join(__dirname, "/../views/timetable.html"));
});

module.exports = router;
