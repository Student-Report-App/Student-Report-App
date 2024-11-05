const mongoose = require("mongoose");

const TimeTableSchema = new mongoose.Schema(
  {
    Branch: { type: String, required: true },
    Monday: { type: [String], default: [] },      //will add the default values later but they will be same as Db
    Tuesday: { type: [String], default: [] },    
    Wednesday: { type: [String], default: [] }, 
    Thursday: { type: [String], default: [] },    
    Friday: { type: [String], default: [] },     
  },
  { 
    versionKey: false, 
    collection: "Timetable" 
  }
);


const Timetable = mongoose.model("Timetable", TimeTableSchema);
module.exports = Timetable;
