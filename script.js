const inputElement = document.querySelector(".task");
const buttonElement = document.querySelector(".add");
const listElement = document.querySelector(".list");
const badgeElement = document.querySelector(".remaining-badge");
const emptyState = document.querySelector(".empty-state");

let tasks = [];

const savedTasks = localStorage.getItem("tasks");
if (savedTasks) {
  tasks = JSON.parse(savedTasks);
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateUI() {
  const remaining = tasks.filter(t => !t.completed).length;
  badgeElement.textContent = remaining + " remaining";
  emptyState.classList.toggle("visible", tasks.length === 0);
}

function renderAll() {
  listElement.innerHTML = "";
  for (let i = 0; i < tasks.length; i++) {
    createTask(tasks[i], i);
  }
  updateUI();
}

function createTask(task, index) {
  const li = document.createElement("li");
  if (task.completed) li.classList.add("completed");

  // Checkmark circle
  const check = document.createElement("span");
  check.className = "task-check";
  li.appendChild(check);

  // Title
  const title = document.createElement("span");
  title.className = "task-title";
  title.textContent = task.title;
  li.appendChild(title);

  // Delete button
  const deleteBtn = document.createElement("button");
  deleteBtn.className = "delete-btn";
  deleteBtn.textContent = "×";
  deleteBtn.setAttribute("aria-label", "Delete task");
  li.appendChild(deleteBtn);

  // Delete — stop propagation so it doesn't trigger complete
  deleteBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    tasks.splice(index, 1);
    saveTasks();
    renderAll();
  });

  // Toggle complete
  li.addEventListener("click", function () {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    li.classList.toggle("completed");
    updateUI();
  });

  listElement.appendChild(li);
}

function addTask() {
  const value = inputElement.value.trim();
  if (value === "") return;

  tasks.push({ title: value, completed: false });
  saveTasks();
  renderAll();
  inputElement.value = "";
  inputElement.focus();
}

buttonElement.addEventListener("click", addTask);

// Enter key support
inputElement.addEventListener("keydown", function (e) {
  if (e.key === "Enter") addTask();
});

// Initial render
renderAll();
