//let tasks = [
//  {
//    todo: [
//      {
//        title: "kochwelt page & recipe recommender",
//        des: "Build start page with recipe recommendation...",
//        ass_to: ["AS", "DE", "MB"],
//        due: "12.12.2023",
//        prio: "urgent",
//        cat: "User Story",
//        sub_tasks: [],
//      },
//    ],
//    in_progress: [
//      {
//        title: "HTML base template creation",
//        des: "Create reusable HTML base templates...",
//        ass_to: ["AS", "DE"],
//        due: "23.12.2023",
//        prio: "medium",
//        cat: "User Story",
//        sub_tasks: ["Change header color"],
//      },
//    ],
//    feedback: [
//      {
//        title: "CSS Architecture planning",
//        des: "Define CSS naming conventions and structure...",
//        ass_to: ["AS"],
//        due: "01.12.2023",
//        prio: "medium",
//        cat: "Techniker Task",
//        sub_tasks: [],
//      },
//      {
//        title: "CSS Architecture planning",
//        des: "Define CSS naming conventions and structure...",
//        ass_to: ["AS", "DE", "MB"],
//        due: "01.12.2023",
//        prio: "urgent",
//        cat: "User Story",
//        sub_tasks: [],
//      },
//    ],
//    done: [
//      {
//        title: "contact form and imprint",
//        des: "Create a contact form and imprint page...",
//        ass_to: ["AS", "DE", "MB"],
//        due: "15.12.2023",
//        prio: "urgent",
//        cat: "Techniker Task",
//        sub_tasks: [],
//      },
//    ],
//  },
//];

let tasks = [];
let ass_to_emails = [];
let insert_in;

async function add_task_init(name) {
  if (name == undefined)
  name = 'todo';
  console.log(name);
  insert_in = name;
  ass_to_emails.length = 0;
  await load_users_contacts();
  await load_users_tasks(name);
  contacts();
  insertTask();
}

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
  console.log(ass_to_emails);
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
  prio = priority;
  console.log("Selected Priority:", priority);
}

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
}

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
