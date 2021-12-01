const express = require("express");
const router = new express.Router();
const User = require("../models/user");

router.get("/:id", async(req, res, next) => {
    const { id } = req.params;
    try {
        const highScore = await User.getHighScore(id);
        return res.json({ highScore });
    } catch (error) {
        console.log(error);
        return next(error);
    };
});

router.post("/:id", async(req, res, next) => {
    const { id } = req.params;
    const { newHighScore } = req.body;
    try {
        const highScore = await User.setHighScore(id, newHighScore);
        return res.json({ highScore });
    } catch (error) {
        console.log(error);
        return next(error);
    }
});

module.exports = router;