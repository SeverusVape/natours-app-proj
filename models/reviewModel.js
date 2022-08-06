const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
    {
        review: {
            type: String,
            required: [true, "Review can't be empty!"],
        },
        rating: {
            type: Number,
            min: 1,
            max: 5,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        tour: {
            type: mongoose.Schema.ObjectId,
            ref: "Tour",
            required: [true, "Review must belongs to a tour."],
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: "User",
            required: [true, "Review must has an author."],
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// MIDDLEWARES
reviewSchema.pre(/^find/, function (next) {
    this.populate({
        path: "user",
        select: "name photo",
    });
    next();
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
