const mongoose = require("mongoose");

const subjectDetailsSchema = new mongoose.Schema(
  {
    credit: Number,
    title: String,
    lecturer: String,
    code: String,
    CSE: String,
    ECE: String,
    DSAI: String,
    A1: String,
    A2: String,
    B: String,
  },
  { _id: false }
);

const subjectSchema = new mongoose.Schema(
  {
    Branch: String,
    PNS: subjectDetailsSchema,
    SD: subjectDetailsSchema,
    DLD: subjectDetailsSchema,
    ITP: subjectDetailsSchema,
    DM: subjectDetailsSchema,
    LAMA: subjectDetailsSchema,
    SNA: subjectDetailsSchema,
    ILC: subjectDetailsSchema,
    SHV: subjectDetailsSchema,
    EVS: subjectDetailsSchema,
  },
  { versionKey: false, collection: "Subjects" }
);

const Subject = mongoose.model("Subject", subjectSchema);

module.exports = Subject;
