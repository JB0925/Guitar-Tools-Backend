const express = require("express");
const cors = require("cors");
const { AuthenticateJWT } = require("./helpers/tokens");
const authRoutes = require("./routes/auth");
const { ExpressError, NotFoundError } = require("./expressError");

const app = express();
app.use(AuthenticateJWT);
app.use(cors());
app.use(express.json());
app.use("/auth", authRoutes);

app.use((req, res, next) => {
    return next(new NotFoundError());
});


app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message;

    return res.status(status).json({
        error: { message, status }
    });
});

module.exports = app;