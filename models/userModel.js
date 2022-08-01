/* eslint-disable prettier/prettier */
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required."],
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Email is required."],
        trim: true,
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, "Email should be valid..."],
    },
    photo: {
        type: String,
    },
    role: {
        type: String,
        // ! ADD 'admin' roles only in MONGODB ATLAS manualy, but not in schema!!!
        // ! All roles that can make changes in app should be setted manually!
        enum: ["user", "guide", "lead-guide", "admin"],
        default: "user",
    },
    password: {
        type: String,
        required: [true, "Password is required."],
        trim: true,
        minlength: 8,
        select: false,
    },
    passwordConfirm: {
        type: String,
        required: [true, "Confirm your password."],
        validate: {
            // ! WORKS ONLY ON SAVE
            validator: function (el) {
                return el === this.password;
            },
            message: "Passwords are not the same.",
        },
    },
    passwordChangedAt: Date,
});

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 12);

    this.passwordConfirm = undefined;
    next();
});

userSchema.methods.correctPassword = async function (
    candidatePassword,
    userPassword
) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(
            this.passwordChangedAt.getTime() / 1000,
            10
        );
        return JWTTimestamp < changedTimestamp;
    }
    return false;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
