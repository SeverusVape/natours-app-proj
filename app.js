/* eslint-disable prettier/prettier */
// CORE and 3rd parties
const morgan = require("morgan");
const express = require("express");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
//
const AppError = require("./utils/appError");
const globalError = require("./controllers/errorController");
const tourRouter = require("./routes/tourRouts");
const userRouter = require("./routes/userRouts");

// EXPRESS
const app = express();

// GLOBAL MIDLEWARE
// set security http headers
app.use(helmet());

// development logging
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

// limited requests from API
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: "To many request from this IP. Try again after 1 hour!",
});
app.use("/api", limiter);

// body parser (req.body)
app.use(express.json({ limit: "10kb" }));

// serving static
app.use(express.static(`${__dirname}/public`));
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});
// ROUTING
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

app.all("*", (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalError);

module.exports = app;
