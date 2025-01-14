/* eslint-disable prettier/prettier */
const mongoose = require("mongoose");
const slugify = require("slugify");
//const User = require("./userModel");

const tourSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Tour must have a name."],
            trim: true,
            unique: true,
            maxlength: [40, "Tour must have 40 or less characters..."],
            minlength: [10, "Tour must have minimum 10 characters..."],
        },
        slug: String,
        duration: {
            type: Number,
            required: [true, "Tour must have a duration."],
        },
        maxGroupSize: {
            type: Number,
            required: [true, "Tour must have a group size."],
        },
        difficulty: {
            type: String,
            required: [true, "Tour must have a difficulty."],
            enum: ["easy", "medium", "difficult"],
            message: "Difficulty is either: easy, medium or difficult.",
        },
        ratingsAverage: {
            type: Number,
            default: 4.5,
            min: [1, "Rating must be above 1.0"],
            max: [5, "Rating must be below 5.0"],
            set: (val) => Math.round(val * 10) / 10,
        },
        ratingsQuantity: {
            type: Number,
            default: 0,
        },
        price: {
            type: Number,
            required: [true, "Tour must have a price."],
        },
        priceDiscount: {
            type: Number,
            validate: {
                validator: function (val) {
                    // not workig on update
                    return val < this.price;
                },
                message: "Discount price should be below the regular price...",
            },
        },
        summary: {
            type: String,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
            required: [true, "Tour must have a description."],
        },
        imageCover: {
            type: String,
            required: [true, "Tour must have a cover image."],
        },
        images: [String],
        createdAt: {
            type: Date,
            default: Date.now(),
            select: false,
        },
        startDates: [Date],
        secretTour: {
            type: Boolean,
            default: false,
        },
        startLocation: {
            // GeoJSON
            type: {
                type: String,
                default: "Point",
                enum: ["Point"],
            },
            coordinates: [Number],
            address: String,
            description: String,
        },
        locations: [
            {
                type: {
                    type: String,
                    default: "Point",
                    enum: ["Point"],
                },
                coordinates: [Number],
                address: String,
                description: String,
                day: Number,
            },
        ],
        guides: [
            {
                type: mongoose.Schema.ObjectId,
                ref: "User",
            },
        ],
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: "2dsphere" });

tourSchema.virtual("durationWeeks").get(function () {
    return this.duration / 7;
});

tourSchema.virtual("reviews", {
    ref: "Review",
    foreignField: "tour",
    localField: "_id",
});

// MIDDLWARES

tourSchema.pre("save", function (next) {
    this.slug = slugify(this.name, { lower: true });
    next();
});

// tourSchema.pre("save", async function (next) {
//     const guidesPromises = this.guides.map(
//         async (id) => await User.findById(id)
//     );
//     this.guides = await Promise.all(guidesPromises);
//     next();
// });

// tourSchema.pre("save", function (next) {
//     //
//     next();
// });
// tourSchema.post("save", function (doc, next) {
//     //
//     next();
// });

// QUERY MIDLWARE
// tourSchema.pre("find", function (next) {
//     this.find({ secretTour: { $ne: true } });
//     next();
// });

tourSchema.pre(/^find/, function (next) {
    this.populate({
        path: "guides",
        select: "-__v -passwordChangedAt",
    });

    next();
});

// AGREGATION MIDLWARE
// tourSchema.pre("aggregate", function (next) {
//     this.pipline().unshift({ $match: { secretTour: { $ne: true } } });
//     next();
// });

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
