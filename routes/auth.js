const express = require("express");
const router = new express.Router();
const jsonschema = require("jsonschema");
const { createToken } = require("../helpers/tokens");
const { BadRequestError } = require("../expressError");
const User = require("../models/user");
const userSchema = require("../schemas/userSchema.json");

router.post("/signup", async function(req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, userSchema);
        if (!validator.valid) {
            const errors = validator.errors.map(e => e.stack);
            throw new BadRequestError(errors);
        }
        const newUser = await User.register(req.body);
        const token = createToken(newUser);
        return res.status(201).json({ token });
    } catch (error) {
        return next(error);
    }
});

router.post("/login", async function(req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, userSchema);
        if (!validator.valid) {
            const errors = validator.errors.map(e => e.stack);
            throw new BadRequestError(errors);
        }
        const user = await User.authenticate(req.body);
        const token = createToken(user);
        return res.json({ token });
    } catch (error) {
        return next(error);
    }
});

module.exports = router;