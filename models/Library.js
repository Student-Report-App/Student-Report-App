const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema(
  {
    Name: { type: String, required: true },
    Link: { type: String, required: true },
    
  },
  {
    versionKey: false,
    collection: "Library",
  }
);

const Books = mongoose.model("Library", BookSchema);
module.exports = Books;
