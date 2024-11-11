const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    year: { type: String, required: true },
    branch: { type: String, required: true },
    roll: { type: Number, required: true },
    division: { type: String, required: true },
  },
  { versionKey: false, collection: "Users" }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
