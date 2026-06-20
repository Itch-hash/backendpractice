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
