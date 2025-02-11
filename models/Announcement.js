const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema(
  {
    for: { type: String, required: true },
    name: { type: String, required: true },
    at: { type: Date, required: true },
  },
  { versionKey: false, collection: "Announcements" },
);

const Announcement = mongoose.model("Announcement", announcementSchema);
module.exports = Announcement;
