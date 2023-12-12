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
        <div class="option" data-index="${i}" onclick="addBackgroundColour(${i}); toggleCheckbox(${i})">
          <div class="c-name">
            <span class="name_initials" style="background-color: ${userColor}">${nameInitials}</span>
            <span>${users[i].name}</span>
          </div>
          <input type="checkbox" class="checkbox">
        </div>`;
  }
}

// Function to toggle checkbox state
function toggleCheckbox(index) {
  const checkbox = document.querySelector(
    `.option[data-index="${index}"] .checkbox`
  );
  checkbox.checked = !checkbox.checked;
}

function addBackgroundColour(i) {
  const selectedContact = document.querySelector(`.option[data-index="${i}"]`);
  if (selectedContact) {
    selectedContact.classList.toggle("selected-contact");
  }
}

//
function toggleOptions() {
  const optionsContainer = document.getElementById("optionsContainer");
  const toggleIcon = document.querySelector(".contact-select");
  toggleIcon.classList.toggle("active");
  optionsContainer.style.display =
    optionsContainer.style.display === "block" ? "none" : "block";
}

//
function toggleCategory() {
  const categorySelect = document.getElementById("categoryContainer");
  const toggleIcon = document.querySelector(".select-head");
  toggleIcon.classList.toggle("active");
  categorySelect.classList.toggle("active");
}

//
function selectCategory(option) {
  const selectHead = document.getElementById("selectedCat");
  selectHead.textContent = `${option}`;
  toggleCategory();
}

function enterSubtasks() {
  const addCancel = document.getElementById("add-cancel-subtask");
  const addSubtask = document.getElementById("add-subtask");
  addCancel.classList.toggle("add_cancel");
  addSubtask.classList.toggle("d-none");
  if (addCancel.classList.contains("add_cancel")) {
    document.getElementById("enter-subtask").blur();
  }
}

// Function to add a new subtask
function addSubtask() {
  const inputValue = document.getElementById("enter-subtask").value;
  if (inputValue.trim() === "") {
    return;
  }
  const ul = document.getElementById("subtaskList");
  const li = document.createElement("li");
  li.innerHTML += addTaskHTML(inputValue);
  ul.appendChild(li);
  document.getElementById("enter-subtask").value = "";
}

//
function clearInputField() {
  document.getElementById("enter-subtask").value = "";
}

function addTaskHTML(inputValue) {
  return `<span class="subtask-text">
  ${inputValue}
  </span> 
  <input type="text" class="edit-input d-none"> 
  <span class="delete-btn" onclick="deleteSubtask(this.parentNode)"><i class="fa-regular fa-trash-can"></i></span>
 
  <span class="save-btn" onclick="saveSubtask(this.parentNode)"><i class="fa-solid fa-check"></i></span>
  `;
}

{
  /* <span class="edit-btn" onclick="editSubtask(this.parentNode)"><i class="fa-solid fa-pencil"></i></span>  */
}

// Function to delete a subtask
function deleteSubtask(li) {
  const ul = document.getElementById("subtaskList");
  ul.removeChild(li);
}

// Function to edit a subtask
function editSubtask(li) {
  const textSpan = li.querySelector(".subtask-text");
  const input = li.querySelector(".edit-input");

  li.classList.add("editing");
  textSpan.style.display = "none";
  input.style.display = "inline-block";
  input.value = textSpan.textContent;
}

// Function to save an edited subtask
function saveSubtask(li) {
  const textSpan = li.querySelector(".subtask-text");
  const input = li.querySelector(".edit-input");

  li.classList.remove("editing");
  textSpan.textContent = input.value;
  textSpan.style.display = "inline";
  input.style.display = "none";
}
