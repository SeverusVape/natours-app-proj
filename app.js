/* eslint-disable prettier/prettier */
// CORE and 3rd parties
const morgan = require("morgan");
const path = require("path");
const express = require("express");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xssClean = require("xss-clean");
const hpp = require("hpp");
const cookieParser = require("cookie-parser");
//
const AppError = require("./utils/appError");
const globalError = require("./controllers/errorController");
const tourRouter = require("./routes/tourRouts");
const userRouter = require("./routes/userRouts");
const reviewRouter = require("./routes/reviewRouts");
const viewRouter = require("./routes/viewRouts");

// * EXPRESS
const app = express();
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// * GLOBAL MIDLEWAREs
// static
app.use(express.static(path.join(__dirname, "public")));
// set security http headers
app.use(
    helmet({
        contentSecurityPolicy: false,
        crossOriginEmbedderPolicy: false,
    })
);
// Test
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
app.use(cookieParser());
// data sanitization noSQL
app.use(mongoSanitize());
//data sanitization XSS
app.use(xssClean());
// parameters pollution with hpp
app.use(
    hpp({
        whitelist: [
            "duration",
            "ratingsQuantity",
            "ratingsAverage",
            "maxGroupSize",
            "difficulty",
            "price",
        ],
    })
);
// serving static
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    console.log(req.cookies);
    next();
});

// ROUTING
app.use("/", viewRouter);
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter);

app.all("*", (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalError);

module.exports = app;
