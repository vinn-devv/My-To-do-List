const inputElement = document.querySelector(".task");
const buttonElement = document.querySelector(".add");
const listElement = document.querySelector(".list");
const remainingNum = document.getElementById("remaining-num");
const emptyState = document.getElementById("empty-state");
const progressFill = document.getElementById("progress-fill");
const clearBtn = document.getElementById("clear-btn");
const orb = document.querySelector(".orb");

let tasks = [];

// Load tasks and FILTER OUT completed ones on page load
const savedTasks = localStorage.getItem("tasks");
if (savedTasks) {
  const allTasks = JSON.parse(savedTasks);
  tasks = allTasks.filter((t) => !t.completed);
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateUI() {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const remaining = total - completed;

  remainingNum.textContent = remaining;
  remainingNum.classList.toggle("done", remaining === 0 && total > 0);

  emptyState.classList.toggle("visible", total === 0);

  const pct = total === 0 ? 0 : Math.round((completed / total) * 100);
  progressFill.style.width = pct + "%";

  const intensity =
    total === 0 ? 0.12 : Math.min(0.25, 0.08 + remaining * 0.02);
  orb.style.background = `radial-gradient(ellipse at center, rgba(124,111,247,${intensity}) 0%, transparent 70%)`;
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

  const check = document.createElement("span");
  check.className = "task-check";
  li.appendChild(check);

  const title = document.createElement("span");
  title.className = "task-title";
  title.textContent = task.title;
  li.appendChild(title);

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "delete-btn";
  deleteBtn.textContent = "×";
  deleteBtn.setAttribute("aria-label", "Delete task");
  li.appendChild(deleteBtn);

  deleteBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    li.style.opacity = "0";
    li.style.transform = "translateX(8px)";
    li.style.transition = "opacity 0.15s, transform 0.15s";
    setTimeout(() => {
      tasks.splice(index, 1);
      saveTasks();
      renderAll();
    }, 150);
  });

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

clearBtn.addEventListener("click", function () {
  tasks = tasks.filter((t) => !t.completed);
  saveTasks();
  renderAll();
});

buttonElement.addEventListener("click", addTask);

inputElement.addEventListener("keydown", function (e) {
  if (e.key === "Enter") addTask();
});

renderAll();
