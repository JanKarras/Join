let tasks = [];
let selected_category;
let selected_prio;
let subtasksArray = [];

async function add_task_init() {
  await load_users_tasks()
  contacts();
}

async function load_users_tasks() {
  get_all_user();
  tasks = [];
  for (let i = 0; i < all_user.length; i++) {
    const element = all_user[i];
    if (element["email"] == Email) {
      for (let i = 0; i < element["tasks"].length; i++) {
        const contact = element["tasks"][i];
        tasks.push(contact);
      }
      break;
    }
  }
}

async function set_users_tasks() {
  for (let i = 0; i < all_user.length; i++) {
    const element = all_user[i];
    if (element["email"] == Email) {
      element["tasks"] = [];
      for (let j = 0; j < tasks.length; j++) {
        const task = tasks[j];
        element["tasks"].push(task);
      }
      console.log(all_user);
      setItem("users", all_user);
      break;
    }
  }
}

async function contacts() {
  const optionsContainer = document.getElementById("optionsContainer");
  optionsContainer.innerHTML = "";
  await load_users_contacts();
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
  selected_category = option;
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
  const subtaskInput = document.getElementById("enter-subtask");
  const subtaskList = document.getElementById("subtaskList");

  const subtaskText = subtaskInput.value.trim();
  if (subtaskText !== "") {
    // Füge den Subtask zum Array hinzu
    subtasksArray.push(subtaskText);

    // Füge den Subtask zur Liste hinzu
    const li = document.createElement("li");
    li.textContent = subtaskText;
    subtaskList.appendChild(li);

    // Leere das Eingabefeld
    subtaskInput.value = "";
  }
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

// Reset fields
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

  // Reset assigned to (assuming you want to clear the selected contacts)
  const selectBox = document.querySelector(".select-box");
  selectBox.value = "";

  // Uncheck priority buttons
  const prioButtons = document.querySelectorAll(".prio_btns");
  prioButtons.forEach((button) => {
    button.classList.remove("selected");
  });

  // Clear subtasks
  const subtaskInput = document.getElementById("enter-subtask");
  subtaskInput.value = "";

  // Clear subtask list
  const subtaskList = document.getElementById("subtaskList");
  subtaskList.innerHTML = "";
}

function prio(prio) {
  selected_prio = prio;
}

async function add_task() {
  let title = document.getElementById('title_input');
  let des = document.getElementById('description_input');
  let due = document.getElementById('date_input')
  let selectedContacts = get_contacts();
  let cat = selected_category;
  let sub = subtasksArray;
  //console.log(tasks[0]['to_do']);
  let array_to_push =
    {
      'cat': cat,
      'des': des.value,
      'due': due.value,
      'prio': selected_prio,
      'title': title.value,
      'ass_to': selectedContacts,
      'sub_tasks': sub,
    }
  await send_taks_to_user(array_to_push);
}

function get_contacts() {
  selectedContacts = [];
  let assignedToSelect = document.getElementById('optionsContainer');

  // Überprüfe, ob es überhaupt Optionen gibt
  if (assignedToSelect) {
    assignedToSelect.querySelectorAll('.option').forEach((option) => {
      let checkbox = option.querySelector('.checkbox');
      if (checkbox && checkbox.checked) {
        // Überprüfe, ob die Checkbox existiert und ausgewählt ist
        selectedContacts.push({
          index: option.dataset.index,
          email: users[option.dataset.index].email,
        });
      }
    });
  } else {
    selectedContact = [Email];
  }
  
  return selectedContacts;
}

async function send_taks_to_user (array_to_push) {
  for (let i = 0; i < all_user.length; i++) {
    let user = all_user[i];
    console.log(user);
    const user_email = user['email'];
    console.log(user_email);
    for (let j = 0; j < array_to_push['ass_to'].length; j++) {
      const element = array_to_push['ass_to'][j];
      console.log(element);
      if (user_email == element['email']){
        user['taks'][0]['to_do'].push(array_to_push);
        console.log(all_user);
      }
    }
  }
  //await setItem('users', all_user);
  //await get_all_user();
}