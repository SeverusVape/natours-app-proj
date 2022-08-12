const Tour = require("../models/tourModel");
const catchAsync = require("../utils/catchAsync");
//const AppError = require("../utils/appError");

exports.getOverview = catchAsync(async (req, res, next) => {
    // Get data from API
    const tours = await Tour.find();

    res.status(200).render("overview", {
        title: "All Tours",
        tours,
    });
});

exports.getTour = catchAsync(async (req, res) => {
    const tour = await Tour.findOne({ slug: req.params.slug }).populate({
        path: "reviews",
        fields: "review rating user",
    });

    res.status(200).render("tour", {
        title: `${tour.name}`,
        tour,
    });
});
