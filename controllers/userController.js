/* eslint-disable prettier/prettier */
const User = require("../models/userModel");
const multer = require("multer");
const sharp = require("sharp");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const factory = require("./handlerFactory");

// const multerStorage = multer.diskStorage({
//     destination: (req, file, callback) => {
//         callback(null, "public/img/users");
//     },
//     filename: (req, file, callback) => {
//         const ext = file.mimetype.split("/")[1];
//         callback(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//     },
// });

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, callback) => {
    if (file.mimetype.startsWith("image")) {
        callback(null, true);
    } else {
        callback(new AppError("Not an image! Images only...", 400), false);
    }
};

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
});

exports.uploadUserPhoto = upload.single("photo");

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
    if (!req.file) return next();

    req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

    await sharp(req.file.buffer)
        .resize(500, 500)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`public/img/users/${req.file.filename}`);

    next();
});

const filterObj = (obj, ...alowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach((el) => {
        if (alowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
};

exports.getAllUsers = factory.getAll(User);

exports.getUser = factory.getOne(User);

exports.updateUser = factory.updateOne(User);

exports.deleteUser = factory.deleteOne(User);

exports.getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
    // Create ERROR if user POSTs password data
    if (req.body.password || req.body.passwordConfirm) {
        return next(
            new AppError(
                "This route is not for password updates, use /updatePassword route...",
                400
            )
        );
    }
    // Update User document
    const filteredBody = filterObj(req.body, "name", "email");

    if (req.file) filteredBody.photo = req.file.filename;

    const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        filteredBody,
        {
            new: true,
            runValidators: true,
        }
    );

    res.status(200).json({
        status: "success",
        data: {
            user: updatedUser,
        },
    });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, { active: false });

    res.status(204).json({
        status: "success",
        data: null,
    });
});

exports.createUser = (req, res) => {
    res.status(500).json({
        status: "error",
        message: " This rout is undefined! Use sign up instead...",
    });
};
