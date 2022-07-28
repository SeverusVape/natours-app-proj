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
    password: {
        type: String,
        required: [true, "Password is required."],
        trim: true,
        minlength: 8,
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
});

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 12);

    this.passwordConfirm = undefined;
    next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;