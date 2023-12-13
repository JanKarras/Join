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

// async function load_users_tasks() {
//   get_all_user();
//   tasks = [];
//   for (let i = 0; i < all_user.length; i++) {
//     const element = all_user[i];
//     if (element["email"] == Email) {
//       for (let i = 0; i < element["tasks"].length; i++) {
//         const contact = element["tasks"][i];
//         tasks.push(contact);
//       }
//       break;
//     }
//   }
// }

// async function set_users_tasks() {
//   for (let i = 0; i < all_user.length; i++) {
//     const element = all_user[i];
//     if (element["email"] == Email) {
//       element["tasks"] = [];
//       for (let j = 0; j < tasks.length; j++) {
//         const task = tasks[j];
//         element["tasks"].push(task);
//       }
//       console.log(all_user);
//       setItem("users", all_user);
//       break;
//     }
//   }
// }

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

function insertTask() {
  const task = document.getElementById("taskCategoryInProgress");
  task.innerHTML += taskHTML();
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

// Modify setPriority to include image source
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

  console.log("Selected Priority:", priority);
}

function insertTask() {
  // Extract values from input fields
  const title = document.getElementById("title_input").value;
  const description = document.getElementById("description_input").value;
  const assignedTo = document.querySelector(".select-box").value;
  const dueDate = document.getElementById("date_input").value;

  // Extract priority value
  let priority = "";
  const priorityButtons = document.querySelectorAll(".prio_btns");
  priorityButtons.forEach((button) => {
    if (button.classList.contains("selected")) {
      priority = button.classList[1]; // Assuming the class name represents the priority
    }
  });

  // Extract category value
  const category = document.getElementById("selectedCat").innerText;

  // Extract subtasks
  const subtaskListItems = document.querySelectorAll("#subtaskList li");
  const subtasks = Array.from(subtaskListItems).map((item) => item.innerText);

  const newTask = {
    title: title,
    des: description,
    ass_to: assignedTo.split(","), // Convert assignedTo to an array
    due: dueDate,
    prio: priority,
    cat: category,
    sub_tasks: subtasks,
  };
  tasks[0].todo.push(newTask);
  clearFields();
  displayTasks();
}
