import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { askUntilValid, welcome, listTasks } from "./utils.js";
import fs from "node:fs/promises";

// Create the interface
const rl = readline.createInterface({ input, output });
const path = "./tasks.json";
try {
  let data = await fs.readFile(path, "utf-8");
  if (!data) {
    data = "[]";
    await fs.writeFile(path, data, "utf-8");
  }

  const tasks = JSON.parse(data);

  switch (process.argv[2]?.toLowerCase()) {
    case undefined:
      welcome();
      break;

    case "list":
      switch (process.argv[3]?.toLowerCase()) {
        case undefined:
          if (tasks?.length === 0 || !tasks) {
            console.log("There are no tasks yet, add your first task now");
          } else listTasks(tasks);
          break;
        case "todo":
          {
            listTasks(tasks, "Todo");
          }
          break;
        case "done":
          {
            listTasks(tasks, "Done");
          }
          break;
        case "progress":
          {
            listTasks(tasks, "In-progress");
          }
          break;
      }
      break;
    case "add":
      if (process.argv[4] === undefined) {
        if (process.argv[3]) {
          await addTask(process.argv[3], tasks);
        } else console.log("You must add a task name");
      } else {
        console.error("Task names with spaces must be in quotation marks");
      }
      break;
    case "reset":
      await deleteAllTasks();
      break;
    case "delete":
      !isNaN(process.argv[3])
        ? await deleteTask(process.argv[3], tasks)
        : console.log("You must select a valid ID");
      break;

    case "mark":
      if (!isNaN(process.argv[3])) {
        switch (process.argv[4]?.toLowerCase()) {
          case "progress":
            await updateStatus(tasks, process.argv[3], "In-progress");
            break;
          case "todo":
            await updateStatus(tasks, process.argv[3], "Todo");
            break;
          case "done":
            await updateStatus(tasks, process.argv[3], "Done");
            break;
        }
      } else {
        console.log("You must insert a valid ID");
      }
      break;
    case "update":
      await updateTask(tasks, process.argv[3], process.argv[4]);
      break;
  }
} catch (error) {
  if (error.code === "ENOENT") {
    await createJSON();
  } else console.error(error);
} finally {
  rl.close();
}

async function addTask(task, tasks) {
  try {
    const taskFiltered = task.trim();
    const lastID = tasks.length ? tasks[tasks.length - 1].id : 0;
    const taskFormatted = {
      id: lastID + 1,
      description: taskFiltered,
      status: "Todo",
      createdAt: new Date().toLocaleString(),
      updatedAt: null,
    };
    tasks.push(taskFormatted);
    await fs.writeFile(path, JSON.stringify(tasks), "utf-8");
    return console.log(
      `${taskFormatted.description} (ID:${taskFormatted.id}) has been created successfully`,
    );
  } catch (error) {
    console.error("Something went wrong, check the error below", error);
  }
}

async function createJSON() {
  const noJSON = await rl.question(
    "No JSON file found to save the tasks, would you like to create one now? (Y/N) ",
  );

  if (noJSON.toUpperCase() === "Y") {
    const newPath = await fs.writeFile(path, "[]", "utf-8");
    return console.log("tasks.json has been created successfully");
  } else if (noJSON.toUpperCase() === "N") {
    return console.log("No problem, come back again when you are ready.");
  } else return console.log("Invalid input, try again later.");
}

async function deleteAllTasks() {
  const response = await rl.question(
    "Are you sure you want to delete all tasks? \n\ This action is irreversible. (Y/N) ",
  );

  if (response.toUpperCase() === "Y") {
    await fs.writeFile(path, "[]", "utf-8");
    return console.log("All Tasks have been deleted!");
  } else if (response.toUpperCase() === "N") {
    return console.log("Cancelled Process.");
  } else return console.log("Invalid input, try again later.");
}

async function deleteTask(taskID, tasks) {
  try {
    const checkID = tasks.find((task) => task.id == taskID);
    if (checkID === undefined) {
      return console.log(`Task ID (${taskID}) doesn't Exist`);
    }
    const filteredTasks = tasks.filter((task) => task.id != taskID);
    await fs.writeFile(path, JSON.stringify(filteredTasks), "utf-8");
    return listTasks(filteredTasks);
  } catch (error) {
    console.error(error);
  }
}

async function updateStatus(tasks, taskID, status) {
  try {
    const checkID = tasks.find((task) => task.id == taskID);
    if (checkID === undefined) {
      return console.log(`Task ID (${taskID}) doesn't Exist`);
    }

    const task = tasks.find((task) => task.id == taskID);
    const taskIndex = tasks.findIndex((task) => task.id == taskID);
    if (task.status == status) {
      return console.log(`Task ${task.id} is already marked as ${status}`);
    }
    task.status = status;
    task.updatedAt = new Date().toLocaleString();
    tasks[taskIndex] = task;
    await fs.writeFile(path, JSON.stringify(tasks), "utf-8");
    listTasks(tasks);
  } catch (error) {
    console.error(error);
  }
}

async function updateTask(tasks, taskID, description) {
  try {
    const checkID = tasks.find((task) => task.id == taskID);
    if (checkID === undefined) {
      return console.log(`Task ID (${taskID}) doesn't Exist`);
    }
    const task = tasks.find((task) => task.id == taskID);
    const taskIndex = tasks.findIndex((task) => task.id == taskID);

    task.description = description;
    task.updatedAt = new Date().toLocaleString();

    await fs.writeFile(path, JSON.stringify(tasks), "utf-8");
    listTasks(tasks);
  } catch (error) {
    console.error(error);
  }
}
