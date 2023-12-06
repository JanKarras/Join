async function add_task_init() {
  contacts();
}

function toggleOptions() {
  const optionsContainer = document.getElementById("optionsContainer");
  optionsContainer.style.display =
    optionsContainer.style.display === "block" ? "none" : "block";
}

function selectUser(index) {
  const selectedOption = document.getElementById("selectedOption");
  selectedOption.textContent = users[index].name;
  toggleOptions();
}

function contacts() {
  const optionsContainer = document.getElementById("optionsContainer");
  optionsContainer.innerHTML = "";
  for (let i = 0; i < users.length; i++) {
    optionsContainer.innerHTML += `<div class="option" onclick="selectUser(${i})">${users[i].name}</div>`;
  }
}
function selectUser(index) {
  const selectedOption = document.getElementById("selectedOption");
  selectedOption.textContent = users[index].name;
  toggleOptions();
}

function contacts() {
  const optionsContainer = document.getElementById("optionsContainer");
  optionsContainer.innerHTML = "";
  for (let i = 0; i < users.length; i++) {
    optionsContainer.innerHTML += `<div class="option" onclick="selectUser(${i})">${users[i].name}</div>`;
  }
}
