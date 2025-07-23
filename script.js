// ======== Global Variables ========
const taskListElement = document.getElementById("taskList");
const taskInput = document.getElementById("taskInput");
const toggleBtn = document.getElementById("darkModeToggle");

// ======== On Page Load ========
window.onload = function () {
  loadTasks();
  setupEventListeners();
  restoreDarkModeIcon();
};

// ======== Event Listeners ========
function setupEventListeners() {
  // Add task on Enter key
  taskInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") addTask();
  });

  // Dark mode toggle
  toggleBtn.addEventListener("click", toggleDarkMode);

  // Bulk action buttons
  document.getElementById("markAllBtn").addEventListener("click", markAllTasks);
  document.getElementById("clearAllBtn").addEventListener("click", clearAllTasks);
}

// ======== Task Functions ========
function addTask() {
  const taskText = taskInput.value.trim();
  if (!taskText) {
    alert("Please enter a task!");
    return;
  }

  const tasks = getTasksFromStorage();
  tasks.push({ text: taskText, completed: false });
  saveTasksToStorage(tasks);

  renderTasks();
  taskInput.value = "";
}

function renderTasks() {
  taskListElement.innerHTML = "";
  const tasks = getTasksFromStorage();

  tasks.forEach((task, index) => {
    const li = document.createElement("li");

    // Checkbox
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.onchange = () => {
      task.completed = checkbox.checked;
      saveTasksToStorage(tasks);
      renderTasks();
    };

    // Task text
    const textNode = document.createTextNode(task.text);
    if (task.completed) li.style.textDecoration = "line-through";

    // Delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "❌";
    deleteBtn.onclick = () => {
      tasks.splice(index, 1);
      saveTasksToStorage(tasks);
      renderTasks();
    };

    // Append elements
    li.appendChild(checkbox);
    li.appendChild(textNode);
    li.appendChild(deleteBtn);
    taskListElement.appendChild(li);
  });
}

function markAllTasks() {
  const tasks = getTasksFromStorage().map(task => ({
    ...task,
    completed: true
  }));
  saveTasksToStorage(tasks);
  renderTasks();
}

function clearAllTasks() {
  if (confirm("Are you sure you want to delete all tasks?")) {
    localStorage.removeItem("tasks");
    renderTasks();
  }
}

// ======== Local Storage Functions ========
function getTasksFromStorage() {
  const tasks = localStorage.getItem("tasks");
  return tasks ? JSON.parse(tasks) : [];
}

function saveTasksToStorage(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// ======== Dark Mode Functions ========
function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
  const isDark = document.body.classList.contains("dark-mode");
  toggleBtn.textContent = isDark ? "☀️" : "🌙";
  localStorage.setItem("dark-mode", isDark);
}

function restoreDarkModeIcon() {
  const darkModeEnabled = localStorage.getItem("dark-mode") === "true";
  if (darkModeEnabled) {
    document.body.classList.add("dark-mode");
    toggleBtn.textContent = "☀️";
  } else {
    toggleBtn.textContent = "🌙";
  }
}

// ======== Initialize ========
function loadTasks() {
  renderTasks();
}
