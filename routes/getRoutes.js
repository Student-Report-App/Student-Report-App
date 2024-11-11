const express = require("express");
const router = express.Router();
const path = require("path");

const sendFileIfAuthenticated = (req, res, filePath) => {
  if (req.session.user) {
    res.sendFile(path.join(__dirname, filePath));
  } else {
    res.redirect("/404");
  }
};

router.get("/", (req, res) => {
  if (req.session.user) {
    res.redirect("/dashboard");
  } else {
    res.sendFile(path.join(__dirname, "/../views/index.html"));
  }
});

router.get("/dashboard", (req, res) => {
  sendFileIfAuthenticated(req, res, "/../views/dashboard.html");
});

router.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "/../views/register.html"));
});

router.get("/404", (req, res) => {
  res.sendFile(path.join(__dirname, "/../views/404.html"));
});

router.get("/timetable", (req, res) => {
  sendFileIfAuthenticated(req, res, "/../views/timetable.html");
});

router.get("/library", (req, res) => {
  sendFileIfAuthenticated(req, res, "/../views/library.html");
});

router.get("/profile", (req, res) => {
  sendFileIfAuthenticated(req, res, "/../views/profile.html");
});

router.get("/changepassword", (req, res) => {
  sendFileIfAuthenticated(req, res, "/../views/changepassword.html");
});

router.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "/../views/about.html"));
});

module.exports = router;
