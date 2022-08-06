const Review = require("../models/reviewModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

// GET ALL
exports.getAllReviews = catchAsync(async (req, res, next) => {
    const reviews = await Review.find();

    if (!reviews) return next(new AppError("No reviews found.", 404));

    res.status(200).json({
        status: "success",
        results: reviews.length,
        data: {
            reviews,
        },
    });
});

// CREATE ONE
exports.createReview = catchAsync(async (req, res, next) => {
    if (!req.body.tour) req.body.tour = req.params.tourId;
    if (!req.body.user) req.body.user = req.user.id;

    const newReviw = await Review.create(req.body);

    // if (!newReviw) return next(new AppError("Review wasn't created...", 400));

    res.status(200).json({
        status: "success",
        data: {
            review: newReviw,
        },
    });
});

// exports.deleteReview = catchAsync(async (req, res, next) => {
//     res.status(200).json({
//         status: "success",
//         results: reviews.length,
//         data: {
//             reviews,
//         },
//     });
//     return next(new AppError("Review wasn't deleted...", 400));
// });

// exports.updateReview = catchAsync(async (req, res, next) => {
//     res.status(200).json({
//         status: "success",
//         results: reviews.length,
//         data: {
//             reviews,
//         },
//     });
//     return next(new AppError("Review wasn't updated...", 400));
// });
