const express = require("express");
const router = express.Router();

router.get("/api", (req, res) => {
    if (!req.session.user) {
        return res.redirect('/404');
    }
    res.json(req.session.user)
});

module.exports = router;
