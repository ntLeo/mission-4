const mongoose = require("mongoose");

// Cars schema
const carsSchema = new mongoose.Schema({
  model: String,
  year: Number,
  imageURL: String,
});

// Cars model
module.exports = mongoose.model("Cars", carsSchema);
