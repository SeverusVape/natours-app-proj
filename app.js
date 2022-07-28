/* eslint-disable prettier/prettier */
// CORE and 3rd parties
const morgan = require("morgan");
const express = require("express");
const AppError = require("./utils/appError");
const globalError = require("./controllers/errorController");
const tourRouter = require("./routes/tourRouts");
const userRouter = require("./routes/userRouts");

// EXPRESS
const app = express();

// MIDLEWARE
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

// ROUTING
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

app.all("*", (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalError);

module.exports = app;
