const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    link: { type: String, required: true },
  },
  { versionKey: false, collection: "Library" },
);

const Book = mongoose.model("Book", bookSchema);
module.exports = Book;
