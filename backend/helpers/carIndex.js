const mongoose = require("mongoose");

// Map global promise - get rid of warning
mongoose.Promise = global.Promise;

// Connect to mongoDB ------------------------------------------ //

const mongoURL = "mongodb://localhost:27017/carAPI";

mongoose.connect(mongoURL).catch((err) => console.log(err));

// Import model
const Cars = require("../models/carsSchema");

// Add car
const addCar = (car) => {
  Cars.create(car).then((car) => {
    console.info("New car added");
    mongoose.connection.close();
  });
};

// List cars
const listCars = () => {
  Cars.find().then((cars) => {
    console.info(cars);
    console.info(`${cars.length} cars`);
    mongoose.connection.close();
  });
};

// Update Car
const updateCar = (_id, car) => {
  Cars.updateOne({ _id }, car).then((car) => {
    console.info("Car updated");
    mongoose.connection.close();
  });
};

// Delete car
const removeCar = (_id) => {
  Cars.deleteOne({ _id }).then((car) => {
    console.info("Car removed");
    mongoose.connection.close();
  });
};

// export models

module.exports = {
  addCar,
  listCars,
  updateCar,
  removeCar,
};
