const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: String,
    username: String,
    email: String,
    password: String,
    year: String,
    branch: String,
    roll: Number
  },
  { versionKey: false, collection: "Users" }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
