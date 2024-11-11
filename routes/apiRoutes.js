const express = require("express");
const router = express.Router();
const Timetable = require("../models/Timetable");
const Subject = require("../models/Subject");
const Book = require("../models/Book");

router.get("/api/userdata", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/404");
  }
  res.json(req.session.user);
});

router.get("/api/timetable/branch/:branch", async (req, res) => {
  try {
    const timetable = await Timetable.findOne({
      Branch: req.params.branch.toUpperCase(),
    });
    res.json(timetable);
  } catch (err) {
    res.send(err);
  }
});

router.get("/api/timetable/division/:division", async (req, res) => {
  try {
    const timetable = await Timetable.findOne({
      Division: req.params.division.toUpperCase(),
    });
    res.json(timetable);
  } catch (err) {
    res.send(err);
  }
});

router.get("/api/timetable/branch/:branch/:day", async (req, res) => {
  try {
    const timetable = await Timetable.findOne({
      Branch: req.params.branch.toUpperCase(),
    });
    res.json(timetable[req.params.day]);
  } catch (err) {
    res.send(err);
  }
});

router.get("/api/timetable/division/:division/:day", async (req, res) => {
  try {
    const timetable = await Timetable.findOne({
      Division: req.params.division.toUpperCase(),
    });
    res.json(timetable[req.params.day]);
  } catch (err) {
    res.send(err);
  }
});

router.get("/api/subject/:subject", async (req, res) => {
  const subject = req.params.subject.toUpperCase();
  try {
    const subjectData = await Subject.findOne({});
    res.json(subjectData[subject]);
  } catch (err) {
    res.send(err);
  }
});

router.get("/api/books", async (req, res) => {
  try {
    const bookData = await Book.find({});
    res.json(bookData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
