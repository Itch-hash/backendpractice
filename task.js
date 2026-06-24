import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { askUntilValid, welcome } from "./utils.js";
import fs from "node:fs/promises";

// Create the interface
const rl = readline.createInterface({ input, output });
try {
  const data = await fs.readFile("./tasks.json", "utf-8");
  const tasks = JSON.parse(data);

  switch (process.argv[2]?.toLowerCase()) {
    case undefined:
      welcome();
      break;

    case "list":
      tasks.length === 0
        ? console.log("There are no tasks yet, add your first task now")
        : console.log(tasks);
      break;
    case "add":
      if (process.argv[4] === undefined) {
        if (process.argv[3]) {
          await addTask(process.argv[3]);
        } else console.log("You must add a task name");
      } else {
        console.error("Task names with spaces must be in quotation marks");
      }
      break;
  }
} catch (error) {
  if (error.code === "ENOENT") {
    await createJSON();
  } else console.error(error);
} finally {
  rl.close();
}

async function addTask(task) {
  return console.log(`${task} created successfully!`);
}

async function createJSON() {
  const noJSON = await rl.question(
    "No JSON file found to save the tasks, would you like to create one now? (Y/N) ",
  );

  if (noJSON.toUpperCase() === "Y") {
    const newPath = await fs.writeFile("./tasks.json", "[]", "utf-8");
    console.log("tasks.json has been created successfully");
    return true;
  } else if (noJSON.toUpperCase() === "N") {
    console.log(
      "No problem, come back again when you are ready to create the file.",
    );
    return false;
  } else console.log("Invalid input, try again later.");
  return false;
}

// 1- Client boots up the initial command node task.js
// 2- app welcomes him and checks if a json file exists with the name "tasks.json"
// 3- if it exists > attempts to read it | else it asks the user if they want to create a new one > if yes, asks for name and creates
// a new json file using that
