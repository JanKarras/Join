let tasks = [
  {
    to_do: [
      {
        title: "TestTitle",
        des: "Description of the Title",
        ass_to: ["test", "test1"],
        due: "12.12.2023",
        prio: "urgent",
        cat: "Techniker",
        sub_tasks: ["test", "test1"],
      },
    ],
    done: [
      {
        title: "TestTitle",
        des: "Description of the Title",
        ass_to: ["test", "test1"],
        due: "15.12.2023",
        prio: "urgent",
        cat: "Techniker",
        sub_tasks: ["test", "test1"],
      },
    ],
    in_progress: [
      {
        title: "TestTitle",
        des: "Description of the Title",
        ass_to: ["test", "test1"],
        due: "23.12.2023",
        prio: "urgent",
        cat: "Techniker",
        sub_tasks: ["test", "test1"],
      },
    ],
    feedback: [
      {
        title: "TestTitle",
        des: "Description of the Title",
        ass_to: ["test", "test1"],
        due: "01.12.2023",
        prio: "urgent",
        cat: "Techniker",
        sub_tasks: ["test", "test1"],
      },
    ],
  },
];

async function add_task_init() {
  //await load_users_tasks()
  contacts();
}

async function load_users_tasks() {
  get_all_user();
  tasks = [];
  for (let i = 0; i < all_user.length; i++) {
    const element = all_user[i];
    if (element["email"] == Email) {
      for (let i = 0; i < element["contacts"].length; i++) {
        const contact = element["contacts"][i];
        users.push(contact);
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
