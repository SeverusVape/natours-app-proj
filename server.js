/* eslint-disable prettier/prettier */

const mongoose = require("mongoose");

const dotenv = require("dotenv");

const app = require("./app");

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace(
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
// schema
const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Tour must have a name."],
        unique: true,
    },
    rating: {
        type: Number,
        default: 4.5,
    },
    price: {
        type: String,
        required: [true, "Tour must have a price."],
    },
});
// model
const Tour = mongoose.model("Tour", tourSchema);

const testTour = new Tour({
    name: "Korean sex rodeo",
    rating: 4.8,
    price: 1999,
});
testTour
    .save()
    .then((doc) => {
        console.log(doc);
    })
    .catch((err) => {
        console.error("==>", err);
    });

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`App running on  port: ${port}...`);
});
