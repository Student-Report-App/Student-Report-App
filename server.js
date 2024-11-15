require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const googlestrategy = require("passport-google-oauth20").Strategy;
const session = require("express-session");
const User = require("./models/User");

const app = express();

// Middleware setup
app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: process.env.SESSION_SECRET || "test",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === "production", 
      sameSite: "strict",
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());


passport.use(
  new googlestrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID, 
      clientSecret: process.env.GOOGLE_CLIENT_SECRET, 

      callbackURL: "http://localhost:3000/auth/google/callback", 
    },
    (accessToken, refreshToken, profile, done) => {
      const user = User.findOne({ email: profile.emails[0].value}).then((currentUser) => {
        // console.log(profile.emails.value);
         //console.log(profile);
        module.exports = currentUser;

        if (currentUser) {
          return done(null, currentUser,{message:"found user"});
        } else {
          return done(null, false, {
            message: "User not found. Redirecting to /register.",
          });
        }
      });
    }
  )
);

passport.serializeUser((user, done) => done(null, user)); 
passport.deserializeUser((user, done) => done(null, user)); 


mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to the database", err));


const getRoutes = require("./routes/getRoutes");
const postRoutes = require("./routes/postRoutes");
const apiRoutes = require("./routes/apiRoutes");

app.use(apiRoutes);
app.use(getRoutes);
app.use(postRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Your app is listening on http://localhost:${PORT}`);
});

