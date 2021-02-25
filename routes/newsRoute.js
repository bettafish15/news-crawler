var express = require("express");
var router = express.Router();
const newsModel = require("../models/newsModel");

/* GET users listing. */
router.get("/getNews", async function (req, res, next) {
    try {
        let category = req.body.category;
        let data = await newsModel
            .find({ category: category })
            .sort({ date: -1 })
            .limit(10);
        res.send(data);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
