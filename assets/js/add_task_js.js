async function add_task_init() {
  contacts();
}

function contacts() {
  const optionsContainer = document.getElementById("optionsContainer");
  optionsContainer.innerHTML = "";
  for (let i = 0; i < users.length; i++) {
    const names = users[i].name.split(" ");
    const nameInitials =
      names[0].charAt(0).toUpperCase() +
      names[names.length - 1].charAt(0).toUpperCase();
    const userColor = getUserColor(i); // Use the getUserColor function from index.js
    optionsContainer.innerHTML += `
        <div class="option" data-index="${i}" onclick="addBackgroundColour(${i})">
          <div class="c-name">
            <span class="name_initials" style="background-color: ${userColor}">${nameInitials}</span>
            <span>${users[i].name}</span>
          </div>
          <input type="checkbox" class="checkbox">
        </div>`;
  }
}

function addBackgroundColour(i) {
  //
  const selectedContact = document.querySelector(`.option[data-index="${i}"]`);
  if (selectedContact) {
    selectedContact.classList.toggle("selected-contact");
  }
}

function toggleOptions() {
  const optionsContainer = document.getElementById("optionsContainer");
  const toggleIcon = document.querySelector(".contact-select");
  toggleIcon.classList.toggle("active");
  optionsContainer.style.display =
    optionsContainer.style.display === "block" ? "none" : "block";
}

function toggleCategory() {
  const categorySelect = document.getElementById("categoryContainer");
  const toggleIcon = document.querySelector(".select-head");
  toggleIcon.classList.toggle("active");
  categorySelect.classList.toggle("active");
}

function selectCategory(option) {
  const selectHead = document.getElementById("selectedCat");
  selectHead.textContent = `${option}`;
  toggleCategory();
}

function addSubtasks() {
  const addTask = document.getElementById("add_cancel_subtask");
  const addSubtask = document.getElementById("add-subtask");
  addTask.classList.add("d-flex");
  addSubtask.classList.add("d-none");
}
