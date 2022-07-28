/* eslint-disable prettier/prettier */
const mongoose = require("mongoose");
const validator = require("validator");

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
    },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
