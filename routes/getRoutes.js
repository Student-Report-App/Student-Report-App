const express = require("express");
const router = express.Router();
const path = require("path");
const passport = require("passport");
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
    res.send('<a href="/auth/google">Login with Google</a>');
  }
});

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] }) 
);

router.get(
  "/auth/google/callback",  
  passport.authenticate("google", { failureRedirect: "/register" }), 
  (req, res) => {
    if (!req.user) {
      res.redirect("/register");  
    } else {
      var loggedinuser = req.user;
      req.session.user = loggedinuser;
      exports.loggedinuser = loggedinuser;
     
      res.redirect("/dashboard");  
    }
  }
);

router.get("/dashboard", (req, res) => {
    res.sendFile(path.join(__dirname, "/../views/dashboard.html"));  
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

router.get("/change-password", (req, res) => {
  sendFileIfAuthenticated(req, res, "/../views/change-password.html");
});

router.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "/../views/about.html"));
});


router.get("/login", (req, res) => {
  if (req.session.user) {
    return res.redirect("/dashboard"); 
    
  }
  res.sendFile(path.join(__dirname, "/../views/index.html"));
});


module.exports = router;
