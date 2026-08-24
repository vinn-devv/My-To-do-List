/*========= TO-DO LIST ======== */
let inputElement = document.querySelector(".task");
let buttonElement = document.querySelector(".add");
let listElement = document.querySelector(".list");
let remainingElement = document.querySelector(".remaining");

let tasks = [];

// Load saved tasks
let savedTasks = localStorage.getItem("tasks");

if (savedTasks) {
  tasks = JSON.parse(savedTasks);
}

// Create task
function createTask(task, index) {
  let newTask = document.createElement("li");

  newTask.textContent = task.title;

  // Show completed status after refresh
  if (task.completed) {
    newTask.classList.add("completed");
  }

  listElement.appendChild(newTask);

  // Delete button
  let buttonTask = document.createElement("button");

  buttonTask.textContent = "❌";

  newTask.appendChild(buttonTask);

  buttonTask.addEventListener("click", function () {
    tasks.splice(index, 1);

    localStorage.setItem("tasks", JSON.stringify(tasks));

    listElement.innerHTML = "";

    for (let i = 0; i < tasks.length; i++) {
      createTask(tasks[i], i);
    }

    updateRemainingTask();
  });

  // Complete task
  newTask.addEventListener("click", function () {
    tasks[index].completed = !tasks[index].completed;

    localStorage.setItem("tasks", JSON.stringify(tasks));

    newTask.classList.toggle("completed");

    updateRemainingTask();
  });
}

// Display saved tasks
for (let i = 0; i < tasks.length; i++) {
  createTask(tasks[i], i);
}

updateRemainingTask();

// Add task
buttonElement.addEventListener("click", function () {
  if (inputElement.value.trim() === "") {
    return;
  }

  let newTask = {
    title: inputElement.value,

    completed: false,
  };

  tasks.push(newTask);

  localStorage.setItem("tasks", JSON.stringify(tasks));

  createTask(newTask, tasks.length - 1);

  inputElement.value = "";

  updateRemainingTask();
});

// Remaining task counter
function updateRemainingTask() {
  let remaining = 0;

  for (let i = 0; i < tasks.length; i++) {
    if (!tasks[i].completed) {
      remaining++;
    }
  }

  remainingElement.textContent = "Remaining Task: " + remaining;
}
