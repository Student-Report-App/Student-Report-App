const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema(
  {
    Branch: String,
    PNS: {
      credit: Number,
      title: String,
      lecturer: String,
      code: String,
    },
    SD: {
      credit: Number,
      title: String,
      lecturer: String,
      code: String,
    },
    DLD: {
      credit: Number,
      title: String,
      lecturer: String,
      code: String,
    },
    ITP: {
      credit: Number,
      title: String,
      lecturer: String,
      code: String,
    },
    DM: {
      credit: Number,
      title: String,
      lecturer: String,
      code: String,
    },
    LAMA: {
      credit: Number,
      title: String,
      lecturer: String,
      code: String,
    },
    SNA: {
      credit: Number,
      title: String,
      lecturer: String,
      code: String,
    },
    ILC: {
      credit: Number,
      title: String,
      lecturer: String,
      code: String,
    },
    SHV: {
      credit: Number,
      title: String,
      lecturer: String,
      code: String,
    },
    EVS: {
      credit: Number,
      title: String,
      lecturer: String,
      code: String,
    },
  },
  { versionKey: false, collection: "Subjects" }
);

const Subject = mongoose.model("Subject", subjectSchema);

module.exports = Subject;
