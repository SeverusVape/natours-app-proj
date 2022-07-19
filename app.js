// Core node
const fs = require("fs");
//Express
const express = require("express");
const app = express();
const port = 3000;

// MIDLEWARE
app.use(express.json());

// * ROUTS

const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

app.get("/api/v1/tours", (req, res) => {
    res.status(200).json({
        status: "success",
        results: tours.length,
        data: {
            tours,
        },
    });
});

app.get("/api/v1/tours/:id", (req, res) => {
    const id = +req.params.id;
    const tour = tours.find((el) => el.id === id);

    if (!tour) {
        return res.status(404).json({
            status: "fail",
            message: "Invalid ID, try again...",
        });
    }

    res.status(200).json({
        status: "success",
        data: {
            tour,
        },
    });
});

app.post("/api/v1/tours", (req, res) => {
    const newId = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({ id: newId }, req.body);

    tours.push(newTour);
    fs.writeFile(
        `${__dirname}/dev-data/data/tours-simple.json`,
        JSON.stringify(tours),
        (error) => {
            res.status(201).json({
                status: "succes",
                data: {
                    tour: newTour,
                },
            });
        }
    );
});

app.listen(port, () => {
    console.log(`App running on  port: ${port}...`);
});
