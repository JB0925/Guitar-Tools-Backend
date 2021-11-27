"use strict";

const db = require("../db");
const bcrypt = require("bcrypt");
const {
  BadRequestError,
} = require("../expressError");

const { BCRYPT_WORK_FACTOR } = require("../config.js");

class User {
    static async register({ username, password }) {
        const duplicateCheck = await db.query(
            `SELECT username
             FROM users
             WHERE username = $1`,
             [username]
        );
        
        if (duplicateCheck.rows[0]) throw new BadRequestError("This username is taken");
        
        const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

        const result = await db.query(
            `INSERT INTO users
             (username, password)
             VALUES
             ($1, $2)
             RETURNING username, password`,
             [username, hashedPassword]
        );
        
        const user = result.rows[0];
        return user;
    };

    static async authenticate({ username, password }) {
        const result = await db.query(
            `SELECT username, password
             FROM users
             WHERE username = $1`,
             [username]
        );

        const user = result.rows[0];
        if (user) {
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (isPasswordValid) {
                delete user.password;
                return user;
            };
        };

        throw new BadRequestError("Invalid username / password");
    };
};

module.exports = User;