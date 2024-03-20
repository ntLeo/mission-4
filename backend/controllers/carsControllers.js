const mongoose = require("mongoose");
// ---------------------------------------------- MongoDB Schema Creation ----------------------------------------------

require("../models/carsSchema");

const CarDetails = mongoose.model("Cars");

// ---------------------------------------------- Endpoints ----------------------------------------------
module.exports.getAllCars = async (req, res) => {
  try {
    await CarDetails.find().then((data) => {
      return res.status(200).json({ status: "Found all cars", data: data });
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

// module.exports.getCarModel = async (req, res) => {
//   try {
//     const { model } = req.params;
//     await CarDetails.find({ model: model }).then((data) => {
//       return res
//         .status(200)
//         .json({ status: `Found car model ${model}`, data: data });
//     });
//   } catch (error) {
//     return res.status(500).json({ message: "Server error" });
//   }
// };

module.exports.getCarModel = async (req, res) => {
  try {
    const { model } = req.query;
    await CarDetails.find({ model: model }).then((data) => {
      return res
        .status(200)
        .json({ status: `Found car model ${model}`, data: data });
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports.getCarYear = async (req, res) => {
  try {
    const { year } = req.query;
    await CarDetails.find({ year: Number(year) }).then((data) => {
      return res
        .status(200)
        .json({ status: `Found car year ${year}`, data: data });
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports.findOneCar = async (req, res) => {
  const { model, year } = req.query;

  try {
    await CarDetails.findOne({ model: model, year: Number(year) }).then(
      (data) => {
        if (data) {
          return res
            .status(200)
            .json({ status: `Found car ${model} ${year}`, data: data });
        } else {
          return res.status(404).json({ message: "Car not found" });
        }
      }
    );
  } catch (error) {
    return res.status(500).json({ message: "This car is not in the database" });
  }
};


// THIS IS SEARCH ALL
module.exports.findAllCarsModelYear = async (req, res) => {
  const { model, year } = req.query;

  try {
    await CarDetails.find({ model: model, year: Number(year) }).then((data) => {
      if (data) {
        return res
          .status(200)
          .json({ status: `Found car ${model} ${year}`, data: data });
      } else {
        return res.status(404).json({ message: "Car not found" });
      }
    });
  } catch (error) {
    return res.status(500).json({ message: "This car is not in the database" });
  }
};
