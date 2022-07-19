// Core node
const fs = require("fs");
//Express
const express = require("express");
const app = express();
const port = 3000;

// MIDLEWARE
app.use(express.json());

//  ROUTING
const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

const getAllTours = (req, res) => {
    res.status(200).json({
        status: "success",
        results: tours.length,
        data: {
            tours,
        },
    });
};

const getTour = (req, res) => {
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
};

const createTour = (req, res) => {
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
};

const updateTour = (req, res) => {
    if (+req.params.id > tours.length) {
        return res.status(404).json({
            status: "fail",
            message: "Invalid ID...",
        });
    }
    res.status(200).json({
        status: "success",
        data: {
            tour: "<UPDATED TOUR GOES HERE...>",
        },
    });
};

const deleteTour = (req, res) => {
    if (+req.params.id > tours.length) {
        return res.status(404).json({
            status: "fail",
            message: "Invalid ID...",
        });
    }
    res.status(204).json({
        status: "success",
        data: null,
    });
};

// app.get("/api/v1/tours", getAllTours);
// app.get("/api/v1/tours/:id", getTour);
// app.post("/api/v1/tours", createTour);
// app.patch("/api/v1/tours/:id", updateTour);
// app.delete("/api/v1/tours/:id", deleteTour);

app.route("/api/v1/tours").get(getAllTours).post(createTour);
app.route("/api/v1/tours/:id")
    .get(getTour)
    .patch(updateTour)
    .delete(deleteTour);

// server listen
app.listen(port, () => {
    console.log(`App running on  port: ${port}...`);
});
