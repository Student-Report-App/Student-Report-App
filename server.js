require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: process.env.SESSION_SECRET || "test",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false,
      sameSite: "strict",
    },
  }),
);

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

app.use((req, res) => {
  res.sendFile(path.join(__dirname, "views/404.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Your app is listening on http://localhost:${PORT}`);
});
