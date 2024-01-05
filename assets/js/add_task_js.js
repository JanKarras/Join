
let tasks = [];
let ass_to_emails = [];
let insert_in;

/**
 * Initializes the addition of a new task.
 * If the 'name' parameter is undefined, sets it to 'todo'.
 * Clears the 'ass_to_emails' array.
 * Asynchronously loads user contacts and tasks for the specified name.
 * Calls the 'contacts' function and 'insertTask' function.
 * 
 * @param {string} name - The name of the task; defaults to 'todo' if undefined.
 */
async function add_task_init(name) {
  if (name == undefined)
  name = 'todo';
  insert_in = name;
  ass_to_emails.length = 0;
  await load_users_contacts();
  await load_users_tasks(name);
  contacts();
  insertTask();
}

/**
 * Asynchronously loads tasks for a specific user and task list.
 * Clears the 'tasks' array and populates it with tasks from the specified task list ('name').
 * 
 * @param {string} name - The name of the task list to load tasks from.
 */
async function load_users_tasks(name){
  tasks.length = 0;
  for (let i = 0; i < all_user.length; i++) {
    const element = all_user[i];
    if (element['email'] == Email) {
      for (let j = 0; j < element['tasks'][0][name].length; j++) {
        const task = element['tasks'][0][name][j];
        tasks.push(task);
      }
      break ; 
    }
  }
}

/**
 * Asynchronously sets the tasks for the current user in the 'all_user' array.
 * Clears the existing tasks for the user and populates the 'tasks' array into the user's 'tasks'.
 * Saves the updated 'all_user' array to the browser storage using the 'setItem' function.
 */
async function set_users_tasks() {
  for (let i = 0; i < all_user.length; i++) {
    const element = all_user[i];
    if (element["email"] == Email) {
      element["tasks"].length = 0;
      for (let j = 0; j < tasks.length; j++) {
        const task = tasks[j];
        element["tasks"].push(task);
      }
      setItem("users", all_user);
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
  const optionsContainer = document.getElementById("optionsContainer");
  optionsContainer.innerHTML = "";
  for (let i = 0; i < users.length; i++) {
    const names = users[i].name.split(" ");
    let nameInitials = names[0].charAt(0).toUpperCase();
    nameInitials += names[names.length - 1].charAt(0).toUpperCase();
    const userColor = getUserColor(i);
    optionsContainer.innerHTML += `
        <div class="option" data-index="${i}" onclick="addBackgroundColour(${i}); toggleCheckbox(${i})">
          <div class="c-name">
            <span class="name_initials" style="background-color: ${userColor}">${nameInitials}</span>
            <span>${users[i].name}</span>
          </div>
          <input type="checkbox" class="checkbox" data-name-initials="${nameInitials}">
        </div>`;
  }
}

/**
 * Toggles the state of the checkbox for the user at the specified index.
 * Updates the 'ass_to_emails' array based on checkbox state changes.
 * Updates the display of selected initials in the UI.
 *
 * @param {number} index - The index of the user in the 'users' array.
 * @param {string} nameInitials - The initials of the user.
 */
function toggleCheckbox(index, nameInitials) {
  const checkbox = document.querySelector(
    `.option[data-index="${index}"] .checkbox`
  );
  checkbox.checked = !checkbox.checked;

  const selectedContInitials = document.querySelector(
    ".selected_cont_initials"
  );

  if (checkbox.checked) {
    // Retrieve nameInitials from data attribute
    const nameInitials = checkbox.getAttribute("data-name-initials");

    // Use span element with innerHTML
    const newSpan = document.createElement("span");
    ass_to_emails.push(users[index]['email']);
  } else {
    const removedIndex = ass_to_emails.findIndex((user) => user === users[index]['email']);
    if (removedIndex !== -1) {
      ass_to_emails.splice(removedIndex, 1);
    }
    // Remove the corresponding span element for the unchecked checkbox
    const spans = document.querySelectorAll(".selected_cont_initials span");
    spans.forEach((span) => {
      if (span.innerText === nameInitials) {
        selectedContInitials.removeChild(span);
      }
    });
  }
}

/**
 * Toggles the background color for the selected contact at the specified index.
 *
 * @param {number} i - The index of the contact in the 'users' array.
 */
function addBackgroundColour(i) {
  const selectedContact = document.querySelector(`.option[data-index="${i}"]`);
  if (selectedContact) {
    selectedContact.classList.toggle("selected-contact");
  }
}

/**
 * Toggles the visibility of the options container and updates the toggle icon.
 */
function toggleOptions() {
  const optionsContainer = document.getElementById("optionsContainer");
  const toggleIcon = document.querySelector(".contact-select");
  toggleIcon.classList.toggle("active");
  optionsContainer.style.display =
    optionsContainer.style.display === "block" ? "none" : "block";
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

/**
 * Toggles the visibility and style of subtask-related elements.
 * Adds or removes the 'add_cancel' class from the 'add-cancel-subtask' element.
 * Adds or removes the 'd-none' class from the 'add-subtask' element.
 * Blurs the focus from the 'enter-subtask' element when the 'add_cancel' class is present.
 */
function enterSubtasks() {
  const addCancel = document.getElementById("add-cancel-subtask");
  const addSubtask = document.getElementById("add-subtask");
  addCancel.classList.toggle("add_cancel");
  addSubtask.classList.toggle("d-none");
  if (addCancel.classList.contains("add_cancel")) {
    document.getElementById("enter-subtask").blur();
  }
}

/**
 * Adds a subtask to the subtask list.
 * Retrieves the input value from the 'enter-subtask' element.
 * Checks if the input value is empty and returns if true.
 * Checks if there are already three or more subtasks and returns if true.
 * Creates a new 'li' element and appends it to the 'subtaskList' element.
 * Clears the input value of the 'enter-subtask' element.
 */
function addSubtask() {
  const inputValue = document.getElementById("enter-subtask").value;
  if (inputValue.trim() === "") {
    return;
  }

  const ul = document.getElementById("subtaskList");
  const liElements = ul.getElementsByTagName("li");

  // Return if there are already more than three li elements
  if (liElements.length >= 3) {
    return;
  }

  const li = document.createElement("li");
  li.innerHTML += addTaskHTML(inputValue);
  ul.appendChild(li);
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
function deleteSubtask(li) {
  const ul = document.getElementById("subtaskList");
  ul.removeChild(li);
}

/**
 * Enables editing mode for a subtask by displaying an input field and hiding the text.
 *
 * @param {HTMLElement} li - The 'li' element representing the subtask.
 */
function editSubtask(li) {
  const textSpan = li.querySelector(".subtask-text");
  const input = li.querySelector(".edit-input");

  li.classList.add("editing");
  textSpan.style.display = "none";
  input.style.display = "inline-block";
  input.value = textSpan.textContent;
}

/**
 * Saves the edited content of a subtask, updating the text and switching back to display mode.
 *
 * @param {HTMLElement} li - The 'li' element representing the subtask.
 */
function saveSubtask(li) {
  const textSpan = li.querySelector(".subtask-text");
  const input = li.querySelector(".edit-input");

  li.classList.remove("editing");
  textSpan.textContent = input.value;
  textSpan.style.display = "inline";
  input.style.display = "none";
}

/**
 * Clears input fields, resets date, category, and assigned-to, unchecks priority buttons,
 * and clears subtask-related elements.
 */
function clearFields() {
  // Clear input fields and textareas
  const inputFields = document.querySelectorAll('input[type="text"], textarea');
  inputFields.forEach((field) => {
    field.value = "";
  });
  // Reset date
  const dateInput = document.getElementById("date_input");
  dateInput.value = "";

  // Reset category
  const selectedCat = document.getElementById("selectedCat");
  selectedCat.innerText = "Select task category";

  // Reset assigned to
  const selectBox = document.querySelector(".select-box");
  selectBox.value = "";

  // Uncheck priority buttons
  const prioButtons = document.querySelectorAll(".prio_btns");
  prioButtons.forEach((button) => {
    button.style.backgroundColor = "initial";
  });

  // Clear subtasks
  const subtaskInput = document.getElementById("enter-subtask");
  subtaskInput.value = "";

  // Clear subtask list
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
  return `<span class="subtask-text">
  ${inputValue}
  </span> 
  <input type="text" class="edit-input d-none"> 
  <span class="delete-btn" onclick="deleteSubtask(this.parentNode)"><i class="fa-regular fa-trash-can"></i></span>
 
  <span class="save-btn" onclick="saveSubtask(this.parentNode)"><i class="fa-solid fa-check"></i></span>
  `;
}

let prio;

/**
 * Sets the priority for a task by updating the button colors and storing the selected priority.
 *
 * @param {string} priority - The priority level ("low", "medium", or "urgent").
 */
function setPriority(priority) {
  let low = document.querySelector(".low");
  let medium = document.querySelector(".medium");
  let urgent = document.querySelector(".urgent");
  let image = document.querySelector(".image");
  
  // reset the buttons
  const prioButtons = document.querySelectorAll(".prio_btns");
  prioButtons.forEach((button) => {
    button.style.backgroundColor = "initial";
  });
  
  if (priority === "low") {
    low.style.backgroundColor = "green";
  } else if (priority === "medium") {
    medium.style.backgroundColor = "orange";
  } else if (priority === "urgent") {
    urgent.style.backgroundColor = "red";
  }
  prio = priority;
}

/**
 * Inserts a new task into the tasks array and sends it to users.
 * Clears input fields, updates user storage, retrieves updated user data,
 * and displays tasks on the board or slides in the image (based on the 'position' variable).
 */
async function insertTask() {
  // Extract values from input fields
  const title = document.getElementById("title_input").value;
  const description = document.getElementById("description_input").value;
  const dueDate = document.getElementById("date_input").value;

  // Extract category value
  const category = document.getElementById("selectedCat").innerText;

  // Extract subtasks
  const subtaskListItems = document.querySelectorAll("#subtaskList li");
  const subtasks = Array.from(subtaskListItems).map((item) => item.innerText);

  if (!title || !dueDate || !description) {
    return;
  }

  // Create a task object
  const newTask = {
    title: title,
    des: description,
    ass_to: ass_to_emails, // Convert assignedTo to an array
    due: dueDate,
    prio: prio,
    cat: category,
    sub_tasks: subtasks,
  };
  tasks.push(newTask);
  await send_taks_to_users(newTask);
  clearFields();
  await setItem('users', all_user);
  await get_all_user();
  if (position == 'board')
    displayTasks();
  else {
    slideInImage();
  }
}

/**
 * Sends a new task to the assigned users by updating their 'tasks' array.
 *
 * @param {object} newTask - The new task object to be sent to users.
 */
async function send_taks_to_users(newTask){
  for (let i = 0; i < all_user.length; i++) {
    const user = all_user[i];
    for (let j = 0; j < newTask['ass_to'].length; j++) {
      if (newTask['ass_to'][j] == user['email'])
      {
        user['tasks'][0][insert_in].length = 0;
        for (let k = 0; k < tasks.length; k++) {
          const task = tasks[k];
          user['tasks'][0][insert_in].push(task);
        }
      }
    }
  }
}

/**
 * Slides in the image by moving it upwards and triggers the 'menue_clicked' function after 2 seconds.
 */
function slideInImage() {
  var image = document.getElementById('slide-in-image');
  
  // Bild nach oben schieben
  image.style.bottom = '50%';
  

  // Timer für die Ausführung der Funktion nach 2 Sekunden
  setTimeout(function() {
    menue_clicked('board');
  }, 2000);
}
