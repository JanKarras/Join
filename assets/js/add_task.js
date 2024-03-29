let tasks = []; //Array of the tasks that are assigend to the logged in user
let assToEmails = []; //Array if the Emails that a new task is assigend to
let insertIn; //Variable in wich category a task will be inserted -> todo, in progress or feedback
/**
 * Initializes the addition of a new task.
 * If the 'name' parameter is undefined, sets it to 'todo'.
 * Clears the 'assToEmails' array.
 * Asynchronously loads user contacts and tasks for the specified name.
 * Calls the 'contacts' function and 'insertTask' function.
 *
 * @param {string} name - The name of the task; defaults to 'todo' if undefined.
 */
async function add_taskInit(name) {
  if (name == undefined) name = "todo";
  insertIn = name;
  assToEmails.length = 0;
  assToEmails.push(Email);
  await loadUsersContacts();
  await loadUsersTasks(name);
  contacts();
  setPriority("medium");
}
/**
 * Asynchronously loads tasks for a specific user and task list.
 * Clears the 'tasks' array and populates it with tasks from the specified task list ('name').
 *
 * @param {string} name - The name of the task list to load tasks from.
 */
async function loadUsersTasks(name) {
  tasks.length = 0;
  for (let i = 0; i < allUser.length; i++) {
    const element = allUser[i];
    if (element["email"] == Email) {
      for (let j = 0; j < element["tasks"][0][name].length; j++) {
        const task = element["tasks"][0][name][j];
        tasks.push(task);
      }
      break;
    }
  }
}

/**
 * Asynchronously sets the tasks for the current user in the 'allUser' array.
 * Clears the existing tasks for the user and populates the 'tasks' array into the user's 'tasks'.
 * Saves the updated 'allUser' array to the browser storage using the 'setItem' function.
 */
async function setUsersTasks() {
  for (let i = 0; i < allUser.length; i++) {
    const element = allUser[i];
    if (element["email"] == Email) {
      element["tasks"].length = 0;
      for (let j = 0; j < tasks.length; j++) {
        const task = tasks[j];
        element["tasks"].push(task);
      }
      setItem("users", allUser);
      break;
    }
  }
}
/**
 * Populates the 'optionsContainer' with user contacts.
 * Iterates through the 'users' array and creates HTML elements for each user.
 * Displays user initials, name, and a checkbox in the 'optionsContainer'.
 * Adds event listeners for background color change and checkbox toggle.
 */
function contacts() {
  let index
  const optionsContainer = document.getElementById("optionsContainer");
  optionsContainer.innerHTML = "";
  for (let i = 0; i < users.length; i++) {
    const names = users[i].name.split(" ");
    let nameInitials = names[0].charAt(0).toUpperCase();
    nameInitials += names[names.length - 1].charAt(0).toUpperCase();
    const userColor = getUserColor(i);
    optionsContainer.innerHTML += `
        <div class="option" data-index="${i}" onclick="addBackgroundColour(${i}), toggleCheckbox(${i})">
          <div class="c-name">
            <span class="name_initials" style="background-color: ${userColor}">${nameInitials}</span>
            <span>${users[i].name}</span>
          </div>
          <input onclick="addBackgroundColour(${i}), toggleCheckbox(${i})" type="checkbox" class="checkbox" data-name-initials="${nameInitials}">
        </div>`;
      if (users[i].email === Email)
        index = i; 
    }
  addBackgroundColour(index);
}

/**
 * Toggles the state of the checkbox for the user at the specified index.
 * Updates the 'assToEmails' array based on checkbox state changes.
 * Updates the display of selected initials in the UI.
 *
 * @param {number} index - The index of the user in the 'users' array.
 * @param {string} nameInitials - The initials of the user.
 */
function toggleCheckbox(index, nameInitials) {
  const checkbox = document.querySelector(
    `.option[data-index="${index}"] .checkbox`
  );
  const selectedContInitials = document.querySelector(
    ".selected_cont_initials"
  );
  if (checkbox.checked) {
    // const nameInitials = checkbox.getAttribute("data-name-initials");
    // const newSpan = document.createElement("span");
    bcolor(index);

    if (checkForEmail(users[index]["email"]) === 1) {
      assToEmails.push(users[index]["email"]);
    }
  } else {
    const removedIndex = assToEmails.findIndex(
      (user) => user === users[index]["email"]
    );
    if (removedIndex !== -1) {
      assToEmails.splice(removedIndex, 1);
    }
    const spans = document.querySelectorAll(".selected_cont_initials span");
    spans.forEach((span) => {
      if (span.innerText === nameInitials) {
        selectedContInitials.removeChild(span);
      }
    });
  }
  render_ass_to();
}

function render_ass_to(){
  const content = document.getElementById('show_ass_to');
  const simulatedTask = {ass_to: assToEmails,};
  let initials = getAssigneeInitials(simulatedTask);
  console.log(initials);
  content.innerHTML = "";
  for (let i = 0; i < initials.length; i++) {
    const inizial = initials[i]['initials'];
    const color = initials[i]['color'];
    content.innerHTML += `<div class="inits_addtask" style="background-color: ${color};">${inizial}</div>`
  }
}

function bcolor(i) {
  const selectedContact = document.querySelector(`.option[data-index="${i}"]`);
  if (selectedContact) {
    selectedContact.classList.add("selected-contact");
  }
}

function checkForEmail(email) {
  for (let i = 0; i < assToEmails.length; i++) {
    const element = assToEmails[i];
    if (element === email) return 0;
  }
  return 1;
}

/**
 * Toggles the background color for the selected contact at the specified index.
 *
 * @param {number} i - The index of the contact in the 'users' array.
 */
function addBackgroundColour(i) {
  const checkbox = document.querySelector(
    `.option[data-index="${i}"] .checkbox`
  );
  checkbox.checked = !checkbox.checked;
  const selectedContact = document.querySelector(`.option[data-index="${i}"]`);
  if (selectedContact) {
    selectedContact.classList.toggle("selected-contact");
  }
}

/**
 * Toggles the visibility of the options container and updates the toggle icon.
 */
function toggleOptions(event) {
  const optionsContainer = document.getElementById("optionsContainer");
  const toggleIcon = document.querySelector(".contact-select");
  toggleIcon.classList.toggle("active");
  optionsContainer.style.display =
    optionsContainer.style.display === "block" ? "none" : "block";
  event.stopPropagation();
  if (optionsContainer.style.display === "block") {
    document.body.addEventListener("click", closeOptions);
  } else {
    document.body.removeEventListener("click", closeOptions);
  }
}

/**
 * Hides the options/contacts when a click occurs outside the container
 */
function closeOptions(event) {
  const optionsContainer = document.getElementById("optionsContainer");
  if (!optionsContainer.contains(event.target)) {
    optionsContainer.style.display = "none";
    document.body.removeAttribute("onclick");
  }
}

/**
 * Toggles the visibility of the category select container and updates the toggle icon.
 */
function toggleCategory() {
  const categorySelect = document.getElementById("categoryContainer");
  const toggleIcon = document.querySelector(".select-head");
  toggleIcon.classList.toggle("active");
  categorySelect.classList.toggle("active");
}

/**
 * Sets the selected category and updates the displayed text in the category select header.
 * Closes the category select container by calling the 'toggleCategory' function.
 *
 * @param {string} option - The selected category option.
 */
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

function addSubtask() {
  const inputValue = document.getElementById("enter-subtask").value;
  const subtaskList = document.getElementById("subtaskList");

  if (inputValue.trim() === "") {
    return;
  }
  const newSubtask = document.createElement("li");
  newSubtask.innerHTML = addTaskHTML(inputValue);
  const editBtn = newSubtask.querySelector(".edit-btn");
  const deleteBtn = newSubtask.querySelector(".delete-btn");
  const saveBtn = newSubtask.querySelector(".save-btn");
  editBtn.addEventListener("click", function () {
    editSubtask(this.parentNode.parentNode);
  });
  deleteBtn.addEventListener("click", function () {
    deleteSubtask(this.parentNode);
  });
  saveBtn.addEventListener("click", function () {
    saveSubtask(this.parentNode.parentNode);
  });
  subtaskList.appendChild(newSubtask);
  document.getElementById("enter-subtask").value = "";
}

/**
 * Clears the input value of the 'enter-subtask' field.
 */
function clearInputField() {
  document.getElementById("enter-subtask").value = "";
}

/**
 * Deletes a subtask by removing its corresponding 'li' element from the subtask list.
 *
 * @param {HTMLElement} li - The 'li' element to be deleted.
 */
function deleteSubtask(element) {
  const listItem = element.closest("li");
  listItem.remove();
}

/**
 * Enables editing mode for a subtask by displaying an input field and hiding the text.
 *
 * @param {HTMLElement} li - The 'li' element representing the subtask.
 */
function editSubtask(parentNode) {
  const subtaskText = parentNode.querySelector(".subtask-text");
  const editInput = parentNode.querySelector(".edit-input");
  const editBtn = parentNode.querySelector(".edit-btn");
  const saveBtn = parentNode.querySelector(".save-btn");
  const li = document.getElementsByTagName("li");
  editInput.value = subtaskText.innerText;
  parentNode.classList.add("editing");
  editBtn.style.display = "none";
  saveBtn.style.display = "block";
}

/**
 * Saves the edited content of a subtask, updating the text and switching back to display mode.
 *
 * @param {HTMLElement} li - The 'li' element representing the subtask.
 */
function saveSubtask(element) {
  const listItem = element.closest("li");
  const subtaskText = listItem.querySelector(".subtask-text");
  const editInput = listItem.querySelector(".edit-input");
  const editBtn = listItem.querySelector(".edit-btn");
  const saveBtn = listItem.querySelector(".save-btn");
  subtaskText.textContent = editInput.value;
  saveBtn.style.display = "none";
  editBtn.style.display = "none";
  editInput.style.display = "none";
  subtaskText.style.display = "block";
  listItem.classList.remove("editing");
}

/**
 * Clears input fields, resets date, category, and assigned-to, unchecks priority buttons,
 * and clears subtask-related elements.
 */
function clearFields() {
  const inputFields = document.querySelectorAll('input[type="text"], textarea');
  inputFields.forEach((field) => {
    field.value = "";
  });
  const dateInput = document.getElementById("date_input");
  dateInput.value = "";
  const selectedCat = document.getElementById("selectedCat");
  selectedCat.innerText = "Select task category";
  const selectBox = document.querySelector(".select-box");
  selectBox.value = "";
  const prioButtons = document.querySelectorAll(".prio_btns");
  prioButtons.forEach((button) => {
    button.style.backgroundColor = "initial";
  });
  const subtaskInput = document.getElementById("enter-subtask");
  subtaskInput.value = "";
  const subtaskList = document.getElementById("subtaskList");
  subtaskList.innerHTML = "";
}
/**
 * Generates HTML markup for a subtask with the provided input value.
 * Includes text display, an edit input field, delete button, and save button.
 *
 * @param {string} inputValue - The text content of the subtask.
 * @returns {string} - HTML markup for the subtask.
 */
function addTaskHTML(inputValue) {
  return `
  <span class="subtask-text">${inputValue}</span>
  <div class="buttons"> 
    <input type="text" class="edit-input"> 
    <span class="edit-btn"><i class="fa-solid fa-pencil"></i></span>
    <span class="save-btn"><i class="fa-solid fa-check"></i></span>
    <span class="delete-btn" onclick="deleteSubtask(this.parentNode)"><i class="fa-regular fa-trash-can"></i></span>

  </div>`;
}

let prio; //Variable for the selected prio if an task
/**
 * Sets the priority for a task by updating the button colors and storing the selected priority.
 *
 * @param {string} priority - The priority level ("low", "medium", or "urgent").
 */
function setPriority(priority) {
  let low = document.querySelector(".low");
  let medium = document.querySelector(".medium");
  let urgent = document.querySelector(".urgent");
  const prioButtons = document.querySelectorAll(".prio_btns");
  prioButtons.forEach((button) => {
    button.style.backgroundColor = "initial";
    button.classList.remove("active");
  });
  if (priority === "low") {
    low.style.backgroundColor = "green";
    low.classList.toggle("active");
  } else if (priority === "medium") {
    medium.style.backgroundColor = "orange";
    medium.classList.toggle("active");
  } else if (priority === "urgent") {
    urgent.style.backgroundColor = "red";
    urgent.classList.toggle("active");
  }
  prio = priority;
}

/**
 * Inserts a new task into the tasks array and sends it to users.
 * Clears input fields, updates user storage, retrieves updated user data,
 * and displays tasks on the board or slides in the image (based on the 'position' variable).
 */
async function insertTask() {
  const title = document.getElementById("title_input").value;
  const description = document.getElementById("description_input").value;
  const dueDate = document.getElementById("date_input").value;
  const category = document.getElementById("selectedCat").innerText;
  const successMessage = document.getElementById("success-message");
  const subtaskListItems = document.querySelectorAll("#subtaskList li");
  const subtasks = Array.from(subtaskListItems).map((item) => item.innerText);
  if (!validateFields()) {
    displayError();
    return;
  }
  successMessage.classList.add("d-flex");
  const newTask = {
    title: title,
    des: description,
    ass_to: assToEmails,
    due: dueDate,
    prio: prio,
    cat: category,
    sub_tasks: subtasks,
  };
  tasks.push(newTask);
  await sendTaksToUsers(newTask);
  clearFields();
  await setItem("users", allUser);
  await getAllUser();
  if (position.trim() === "board") {
    await loadUserstasksBoard();
    displayTasks();
    setTimeout(() => {
      successMessage.classList.remove("d-flex");
      closeAddTask();
    }, 1000);
  } else {
    slideInImage();
  }
}

/**
 * Sends a new task to the assigned users by updating their 'tasks' array.
 *
 * @param {object} newTask - The new task object to be sent to users.
 */
async function sendTaksToUsers(newTask) {
  for (let i = 0; i < allUser.length; i++) {
    const user = allUser[i];
    for (let j = 0; j < newTask["ass_to"].length; j++) {
      if (newTask["ass_to"][j] == user["email"]) {
        const task = tasks[tasks.length - 1];
        user["tasks"][0][insertIn].push(task);
      }
    }
  }
}

/**
 * Slides in the image by moving it upwards and triggers the 'menueClicked' function after 2 seconds.
 */
function slideInImage() {
  var image = document.getElementById("slide-in-image");
  image.style.bottom = "50%";
  setTimeout(function () {
    menueClicked("board");
  }, 2000);
}

function validateFields() {
  let titleInput = document.getElementById("title_input");
  let dateInput = document.getElementById("date_input");
  let selectedCat = document.getElementById("selectedCat");
  let selectedHead = document.getElementById("select-head");
  titleInput.classList.remove("error");
  dateInput.classList.remove("error");
  selectedCat.classList.remove("error");
  if (!titleInput.value.trim()) {
    titleInput.classList.add("error");
    return false;
  }
  if (!dateInput.value) {
    dateInput.classList.add("error");
    return false;
  }
  if (selectedCat.innerText === "Select task category") {
    selectedHead.classList.add("error");
    return false;
  }
  // If all fields are filled, return true
  return true;
}

function displayError() {
  const error = document.getElementById("error-message");
  error.classList.add("d-flex");
  setTimeout(() => {
    error.classList.remove("d-flex");
  }, 2000);
}
