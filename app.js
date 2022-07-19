// Core node and 3rd parties
const morgan = require("morgan");
const tourRouter = require("./routes/tourRouts");
const userRouter = require("./routes/userRouts");

// EXPRESS
const express = require("express");
const app = express();

// MIDLEWARE
app.use(morgan("dev"));
app.use(express.json());

//  ROUTING
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

module.exports = app;
