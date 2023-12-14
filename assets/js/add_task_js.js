let tasks = [
  {
    todo: [
      {
        title: "kochwelt page & recipe recommender",
        des: "Build start page with recipe recommendation...",
        ass_to: ["AS", "DE", "MB"],
        due: "12.12.2023",
        prio: "urgent",
        cat: "User Story",
        sub_tasks: [],
      },
    ],
    in_progress: [
      {
        title: "HTML base template creation",
        des: "Create reusable HTML base templates...",
        ass_to: ["AS", "DE"],
        due: "23.12.2023",
        prio: "medium",
        cat: "User Story",
        sub_tasks: ["Change header color"],
      },
    ],
    feedback: [
      {
        title: "CSS Architecture planning",
        des: "Define CSS naming conventions and structure...",
        ass_to: ["AS"],
        due: "01.12.2023",
        prio: "medium",
        cat: "Techniker Task",
        sub_tasks: [],
      },
      {
        title: "CSS Architecture planning",
        des: "Define CSS naming conventions and structure...",
        ass_to: ["AS", "DE", "MB"],
        due: "01.12.2023",
        prio: "urgent",
        cat: "User Story",
        sub_tasks: [],
      },
    ],
    done: [
      {
        title: "contact form and imprint",
        des: "Create a contact form and imprint page...",
        ass_to: ["AS", "DE", "MB"],
        due: "15.12.2023",
        prio: "urgent",
        cat: "Techniker Task",
        sub_tasks: [],
      },
    ],
  },
];

async function add_task_init() {
  await load_users_tasks();
  contacts();
}

async function load_users_tasks() {
  tasks.length = 0;
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
    button.style.backgroundColor = "";
  });

  // Clear subtasks
  const subtaskInput = document.getElementById("enter-subtask");
  subtaskInput.value = "";

  // Clear subtask list
  const subtaskList = document.getElementById("subtaskList");
  subtaskList.innerHTML = "";
}

async function add_task() {
  console.log(tasks);
  let title = document.getElementById("title_input");
  let des = document.getElementById("description_input");
}
