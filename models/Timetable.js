const mongoose = require("mongoose");

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const timetableSchemaDefinition = {
  Branch: { type: String },
  Division: { type: String }
};

daysOfWeek.forEach(day => {
  timetableSchemaDefinition[day] = { type: [String] };
});

const TimeTableSchema = new mongoose.Schema(timetableSchemaDefinition, {
  versionKey: false,
  collection: "Timetable"
});

const Timetable = mongoose.model("Timetable", TimeTableSchema);
module.exports = Timetable;
