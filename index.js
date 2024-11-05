require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require("express-session");
const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  session({
    secret: process.env.SESSION_SECRET || "test", // Secret key for session encryption
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false,
      maxAge: 1000 * 60 * 60 * 24, //for 24 hours
      sameSite: "strict",
    },
  })
);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to the database", err));

// Import routes
const getRoutes = require("./routes/getRoutes");
const postRoutes = require("./routes/postRoutes");

app.use(getRoutes);
app.use(postRoutes);

// Catch-all route handler for undefined routes
app.use((req, res) => {
  res.redirect("/404");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Your app is listening on port ${PORT}`);
});
