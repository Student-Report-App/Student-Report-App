require("dotenv").config();
const express = require("express");
const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;
const mongoose = require("mongoose");
var ALL_USER_DATA = [];

const app = express();
app.use("/public", express.static(process.cwd() + "/public"));
app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Could not Connect to the database", err);
  });

const dataSchema = new mongoose.Schema(
  {
    username: String,
    email: String,
    password: String,
    year: String,
    branch: String,
  },
  { versionKey: false }
);

const refreshData = async () => {
  try {
    ALL_USER_DATA = await GET_ALL_USER();
    console.log("User data refreshed successfully");
    return ALL_USER_DATA;
  } catch (err) {
    console.error("Error refreshing data:", err);
  }
};

const AUTHENTICATION = async (username, password) => {
  ALL_USER_DATA = await refreshData();
  try {
    if (!ALL_USER_DATA) {
      console.log("No data found");
      return undefined;
    }

    let isUser = ALL_USER_DATA.find((user) => user.username === username);
    if (isUser && isUser.password === password) {
      console.log(`User: ${username} successfully authenticated. `);
      return true;
    } else {
      console.log(`Authentication failed for user: ${username}.`);
      return false;
    }
  } catch (err) {
    console.log("Error in Authentication", err);
    return undefined;
  }
};

const GET_ALL_USER = () => {
  const ALL_USER = mongoose.model("Users", dataSchema, "Users"); // Explicitly specify the collection name
  return ALL_USER.find(
    {},
    { _id: 0, email: 1, username: 1, password: 1, year: 1, branch: 1 }
  ).lean();
};

GET_ALL_USER()
  .then(async (data) => {
    ALL_USER_DATA = data;
    //console.log(ALL_USER)
    const isAuthenticated = await AUTHENTICATION("user", "test");
    //console.log(data)
    //console.log(isAuthenticated)
  })
  .catch((err) => {
    console.log("there as an error ", err);
  });

app.listen(PORT, () => {
  console.log("Your app is listening on port " + PORT);
});
