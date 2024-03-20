import { Command } from "commander";
const program = new Command();
import inquirer from "inquirer";

import { addCar, listCars, updateCar, removeCar } from "./helpers/carIndex.js";

// Car Questions
const questions = [
  {
    type: "input",
    name: "model",
    message: "Car Model Type",
  },
  {
    type: "input",
    name: "year",
    message: "Car Model Year",
  },
  {
    type: "input",
    name: "imageURL",
    message: "Car Image URL",
  },
];

program.version("1.0.0").description("Cars Management System");

program
  .command("add")
  .alias("a")
  .description("Add a car to the database")
  .action(() => {
    inquirer.prompt(questions).then((answers) => addCar(answers));
  });

program
  .command("list")
  .alias("l")
  .description("List all cars")
  .action(listCars);

program
  .command("update <_id>")
  .alias("u")
  .description("Update a car")
  .action((_id) => {
    inquirer.prompt(questions).then((answers) => updateCar(_id, answers));
  });

program
  .command("remove <_id>")
  .alias("r")
  .description("Remove a car")
  .action(removeCar);

program.parse(process.argv);
