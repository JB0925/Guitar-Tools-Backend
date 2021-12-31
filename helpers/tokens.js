const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY || "super-secret";

/** return signed JWT from user data. */

function createToken(user) {
  let payload = {
    username: user.username,
  };

  return jwt.sign(payload, SECRET_KEY);
};

function AuthenticateJWT(req, res, next) {
  try {
    const authHeader = req.headers && req.headers.authorization;
    if (authHeader) {
       const token = authHeader.replace(/^[Bb]earer /, "").trim();
       res.locals.user = jwt.verify(token, SECRET_KEY);
    }
    return next();
    } catch (err) {
    return next();
    }
};

module.exports = { createToken, AuthenticateJWT };