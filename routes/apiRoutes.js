const express = require("express");
const router = express.Router();
const Timetable = require("../models/Timetable");

// console.log(Timetable);

router.get("/api/userdata", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/404");
  }
  res.json(req.session.user);
});

router.get("/api/timetable/:branch", async (req, res) => {
  // console.log(req.params);
  try {
    const timetable = await Timetable.findOne({ Branch: req.params.branch });
    res.json(timetable);
  } catch (err) {
    res.send(err);
    // res.send("Internal server error");
  }
});

router.get("/api/timetable/:branch/:day", async (req, res) => {
  // console.log(req.params);
  try {
    const timetable = await Timetable.findOne({ Branch: req.params.branch });
    res.json(timetable.req.params.day);
  } catch (err) {
    res.send(err);
    // res.send("Internal server error");
  }
});
module.exports = router;
