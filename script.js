let users = {}; // { email: { password: '', tasks: [] } }
let currentUser = null;
let isLoginMode = false;

function toggleAuth() {
  isLoginMode = !isLoginMode;
  document.getElementById("auth-title").textContent = isLoginMode ? "Login" : "Sign Up";
  document.querySelector("#auth-container button").textContent = isLoginMode ? "Login" : "Sign Up";
  document.getElementById("toggle-text").textContent = isLoginMode
    ? "Don't have an account?"
    : "Already have an account?";
}

function handleAuth() {
  const email = document.getElementById("auth-email").value.trim().toLowerCase();
  const password = document.getElementById("auth-password").value.trim();

  if (!email || !password) {
    alert("Please enter both email and password.");
    return;
  }

  if (isLoginMode) {
    if (!(email in users)) {
      alert("User does not exist.");
      return;
    }

    if (users[email].password !== password) {
      alert("Incorrect password.");
      return;
    }

    currentUser = email;
    showMainApp();
  } else {
    if (email in users) {
      alert("Email already exists.");
      return;
    }

    users[email] = { password, tasks: [] };
    alert("Account created! You can now log in.");
    toggleAuth();
  }
}

function showMainApp() {
  document.getElementById("auth-container").style.display = "none";
  document.getElementById("main-container").style.display = "block";
  document.getElementById("greeting").textContent = `Welcome, ${currentUser}`;
  renderTasks();
}

function logoutUser() {
  currentUser = null;
  document.getElementById("main-container").style.display = "none";
  document.getElementById("auth-container").style.display = "block";
  document.getElementById("auth-email").value = '';
  document.getElementById("auth-password").value = '';
}

function addTask() {
  const input = document.getElementById("task-input");
  const text = input.value.trim();
  if (text === "") return;

  users[currentUser].tasks.push({ id: Date.now(), text });
  input.value = "";
  renderTasks();
}

function editTask(id) {
  const task = users[currentUser].tasks.find(t => t.id === id);
  const newText = prompt("Edit task:", task.text);
  if (newText && newText.trim() !== "") {
    task.text = newText.trim();
    renderTasks();
  }
}

function deleteTask(id) {
  users[currentUser].tasks = users[currentUser].tasks.filter(t => t.id !== id);
  renderTasks();
}

function renderTasks(searchQuery = "") {
  const list = document.getElementById("task-list");
  const query = searchQuery.toLowerCase().trim();
  const allTasks = users[currentUser]?.tasks || [];

  const filtered = allTasks.filter(task =>
    task.text.toLowerCase().includes(query)
  );

  list.innerHTML = "";

  if (filtered.length === 0) {
    const li = document.createElement("li");
    li.textContent = "No tasks found.";
    li.style.fontStyle = "italic";
    list.appendChild(li);
    return;
  }

  filtered.forEach(task => {
    const li = document.createElement("li");

    const span = document.createElement("span");
    span.textContent = task.text;

    const actions = document.createElement("div");
    actions.classList.add("actions");

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.onclick = () => editTask(task.id);

    const delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.onclick = () => deleteTask(task.id);

    actions.append(editBtn, delBtn);
    li.append(span, actions);
    list.appendChild(li);
  });
}

function searchTasks() {
  const query = document.getElementById("search-input").value;
  renderTasks(query);
}
