/* eslint-disable prettier/prettier */
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const cryoto = require("crypto");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const sendEmail = require("../utils/email");

const signToken = (id) =>
    jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    res.status(statusCode).json({
        status: "success",
        token,
        data: {
            user,
        },
    });
};

exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        passwordChangedAt: req.body.passwordChangedAt,
    });

    createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    // email & password exist ?
    if (!email || !password) {
        return next(new AppError("Please provide email & password...", 400));
    }
    // user exist? password correct?
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError("Incorrect email or password...", 401));
    }
    // if ok, send token
    createSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
    // get token && check is token exists
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        return next(
            new AppError("You are not logged in! Log in to get access.", 401)
        );
    }
    // verificate token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    // user exist?
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
        return next(
            new AppError(
                "The user belongin to this token does no longer exists!",
                401
            )
        );
    }
    // user changed password after JWT was issued?
    if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next(
            new AppError(
                "User recently changed password! Please log in again.",
                401
            )
        );
    }

    //GRAND ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    next();
});

exports.restrictTo =
    (...roles) =>
    (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new AppError("You don't have permissions to make changes!", 403)
            );
        }
        next();
    };

exports.forgotPassword = catchAsync(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user)
        return next(new AppError("There is no user with this @email...", 404));

    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    const resetURL = `${req.protocol}://${req.get(
        "host"
    )}/api/v1/users/resetPassword/${resetToken}`;

    const message = `Forgot your password? Submit a PATCH request with your new password and
    passwordConfirm to: ${resetURL}.\nIf you didn't forgot your password, please ignore this email.`;

    try {
        await sendEmail({
            email: user.email,
            subject: "Your password reset token (valid for 10 min.)",
            message,
        });
        res.status(200).json({
            status: "success",
            message: "Token sent to email.",
        });
    } catch (error) {
        user.passwordResetToken = undefined;
        user.passwordResetExpired = undefined;
        await user.save({ validateBeforeSave: false });

        return next(
            new AppError(
                "There was an error sending the email. Please try again later!",
                500
            )
        );
    }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
    // get user based on the token
    const hashedToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");

    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpired: { $gt: Date.now() },
    });
    // if token not expired set new password
    if (!user) return next(new AppError("Token invalid or expired...", 400));
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpired = undefined;

    await user.save();
    // update password && property of user
    // log the user , sent  JWT
    createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
    // Get user from collection
    const user = await User.findById(req.user.id).select("+password");
    // Check if POSTed currend password is correct
    if (
        !(await user.correctPassword(req.body.passwordCurrent, user.password))
    ) {
        return next(new AppError("Your current pasword is incorrect...", 401));
    }
    // Password correct? update password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();

    // Log user in, send JWT
    createSendToken(user, 200, res);
});
