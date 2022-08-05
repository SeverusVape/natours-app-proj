/* eslint-disable prettier/prettier */
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const fs = require("fs");
const Tour = require("../../models/tourModel");

dotenv.config({ path: "../../config.env" });

const DB = process.env.DATABASE?.replace(
    "<PASSWORD>",
    process.env.DATABASE_PASSWORD
);

mongoose
    .connect(DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
    })
    .then(() => console.log("DB CONNECTED..."));

// Reading
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, "utf-8"));

// Importing to DB
const importData = async () => {
    try {
        await Tour.create(tours);
        console.log("DATA loaded successfully.");
    } catch (err) {
        console.error(err);
    }
    process.exit();
};

// Delete all data from DB
const deleteData = async () => {
    try {
        await Tour.deleteMany();
        console.log("All DATA in DB deleted.");
    } catch (err) {
        console.error(err);
    }
    process.exit();
};

if (process.argv[2] === "--import") {
    importData();
} else if (process.argv[2] === "--delete") {
    deleteData();
}
