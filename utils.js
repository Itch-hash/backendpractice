export async function askUntilValid(rl, question, validator, errorMsg) {
  while (true) {
    const answer = await rl.question(question);
    if (validator(answer)) {
      return answer;
    }
    console.log(errorMsg);
  }
}

export function welcome() {
  return console.log(`Welcome to the TaskCLI App, here are some basic cmds
    
    node task.js add "task name" > Adds a new task
    node task.js remove taskid > Removes the task
    node task.js list > Lists all tasks`);
}

export function listTasks(tasks, status = undefined) {
  const filteredTasks =
    status === undefined
      ? tasks
      : tasks.filter((task) => task.status === status);

  if (status === undefined) {
    return filteredTasks.forEach((task) =>
      console.log(
        `ID: ${task.id} - ${task.description} - Status: ${task.status}`,
      ),
    );
  }

  if (filteredTasks.length > 0 && status != undefined) {
    return filteredTasks.forEach((task) =>
      console.log(
        `ID: ${task.id} - ${task.description} - Status: ${task.status}`,
      ),
    );
  } else {
    return console.log(`You don't have any ${status} tasks.`);
  }
}
