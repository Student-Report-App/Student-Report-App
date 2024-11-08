const mongoose = require("mongoose");

const TimeTableSchema = new mongoose.Schema(
  {
    Branch: { type: String, required: true },
    Monday: { type: [String], default: [] },
    Tuesday: { type: [String], default: [] },
    Wednesday: { type: [String], default: [] },
    Thursday: { type: [String], default: [] },
    Friday: { type: [String], default: [] },
    Saturday: { type: [String], default: [] },
    Sunday: { type: [String], default: [] },
  },
  { versionKey: false, collection: "Timetable" }
);

const Timetable = mongoose.model("Timetable", TimeTableSchema);
module.exports = Timetable;
