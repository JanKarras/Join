let tasks_board = [];

async function board_init() {
  await load_users_contacts();
  await load_users_tasks_board();
  contacts();
  displayTasks();
}

async function load_users_tasks_board() {
  tasks_board.length = 0;
  for (let i = 0; i < all_user.length; i++) {
    const element = all_user[i];
    if (element['email'] == Email) {
      tasks_board = element['tasks'].slice();
      break;
    }
  }
}

function openAddTask() {
  add_task_init();
  let addTask = document.getElementById("addTaskPopUpWindowContent");
  let overlay = document.querySelector(".overlay");
  addTask.classList.remove("d-none");
  overlay.classList.remove("d-none");
  addTask.style.left = "50%";
}
function closeAddTask() {
  let addTask = document.getElementById("addTaskPopUpWindowContent");
  let overlay = document.querySelector(".overlay");
  addTask.classList.add("d-none");
  overlay.classList.add("d-none");
}

function displayTasks() {
  const todo = document.getElementById("todo");
  const inProgress = document.getElementById("in_progress");
  const awaitFeedback = document.getElementById("feedback");
  const done = document.getElementById("done");
  todo.innerHTML = "";
  inProgress.innerHTML = "";
  awaitFeedback.innerHTML = "";
  done.innerHTML = "";

  if (tasks_board[0]['todo'].length == 0)
    todo.innerHTML = "<img src='./assets/img/Notasksfeedback.png'>";

  // Loop through each task status (to_do, in_progress, feedback, done)
  for (const status in tasks_board[0]) {
    if (tasks_board[0].hasOwnProperty(status)) {
      const tasksInStatus = tasks_board[0][status];
      for (let i = 0; i < tasksInStatus.length; i++) {
        const task = tasksInStatus[i];
        const taskHTML = generateTaskHTML(task, status, i);
        switch (status) {
          case "todo":
            todo.innerHTML += taskHTML;
            break;
          case "in_progress":
            inProgress.innerHTML += taskHTML;
            break;
          case "feedback":
            awaitFeedback.innerHTML += taskHTML;
            break;
          case "done":
            done.innerHTML += taskHTML;
            break;
        }
      }
    }
  }
}

function generateTaskHTML(task, status, index) {
  // Generiere eine eindeutige ID für jeden Task
  const taskId = `${status}_${index}`;

  let html = `
    <div class="user_task" draggable="true" ondragstart="drag(event)" data-task-id="${taskId}" onclick="showDetail('${taskId}')">
      <div class="user_story ${task.cat.toLowerCase()}">${task.cat}</div>
      <div class="user_topic">
        <h4>${task.title}</h4>
        <p>${task.des}</p>
      </div>`;

  if (task.sub_tasks.length != 0) {
    let progressWidth = 0
    letprogressWidthpercent = 0;
    const subtasksVisible = status !== "done" ? "" : "d-none";
    for (let i = 0; i < task.sub_tasks.length; i++) {
      const subtask = task.sub_tasks[i];
      if (subtask.endsWith("_finished"))
        progressWidth++;
    }
    progressWidthpercent = (progressWidth / task.sub_tasks.length) * 100;
    html += `
      <div class="task_progress" draggable="true" ondragstart="drag(event)" data-task-id="${taskId}">
        <div class="progress">
          <div class="progressbar" style="width: ${progressWidthpercent}%"></div>
        </div>
        <div class="subtasks ${subtasksVisible}">${progressWidth}/${task.sub_tasks.length} Subtasks</div>
      </div>`;
  }
  if (task.ass_to.length != 0) {
    let initials = []
    for (let i = 0; i < task.ass_to.length; i++) {
      const ass = task.ass_to[i];
      for (let j = 0; j < users.length; j++) {
        const user = users[j];
        if (user['email'] == ass) {
          let name_parts = user['name'].split(" ");
          let firt_name = name_parts[0].charAt(0).toUpperCase();
          let second_name = "";
          if (name_parts.length > 1) {
            second_name = name_parts[name_parts.length - 1].charAt(0).toUpperCase();
          }
          initials.push({
            'initials': firt_name + second_name,
            'color': getUserColor(j),
          });
        }
      }
    }
    html += `<div class="user_assignment"><div class="members">`
    for (let i = 0; i < initials.length; i++) {
      const inizial = initials[i]['initials'];
      const color = initials[i]['color'];
      html += `<div class="inits_board" style="background-color: ${color};">${inizial}</div>`
    }
    if (task.prio.length != 0) {
      html += `
        </div><span><img src="assets/img/${task.prio.toLowerCase()}.png" alt="" /></span>
        </div>
      </div>`;
    }
    else {
      html += `</div>`;
    }
  }
  return html;
}

function allowDrop(event) {
  event.preventDefault();
}

function drag(event) {
  // Übergebe die Task-ID während des Dragging
  const taskId = event.currentTarget.getAttribute("data-task-id");
  event.dataTransfer.setData("text/plain", taskId);
}

function drop(event) {
  event.preventDefault();
  const taskId = event.dataTransfer.getData("text/plain");
  const dropCategoryId = event.target.closest('.taskCategory').id;
  dropped(taskId, dropCategoryId);
}

async function dropped(taskId, dropCategoryId) {
  const lastUnderscoreIndex = taskId.lastIndexOf('_');
  const numberPart = taskId.substring(lastUnderscoreIndex + 1);
  const textPart = taskId.substring(0, lastUnderscoreIndex);
  console.log(numberPart)
  console.log(textPart)
  tasks_board[0][dropCategoryId].push(tasks_board[0][textPart][numberPart])
  tasks_board[0][textPart].splice(numberPart, 1);
  await set_tasks_board();
  await setItem('users', all_user);
  displayTasks();
}

async function set_tasks_board() {
  for (let i = 0; i < all_user.length; i++) {
    const user = all_user[i];
    if (user['email'] == Email) {
      user['tasks'] = tasks_board;
      break;
    }
  }
}

async function showDetail(taskId) {
  const lastUnderscoreIndex = taskId.lastIndexOf('_');
  const numberPart = taskId.substring(lastUnderscoreIndex + 1);
  const textPart = taskId.substring(0, lastUnderscoreIndex);
  console.log(numberPart, textPart);
  await openPopup();
  render_details(numberPart, textPart);
}

async function openPopup() {
  const popupContainer = document.getElementById('showDetail-container');
  popupContainer.style.display = 'block';

  // Animate the popup sliding in from the right
  setTimeout(() => {
    const innerPopup = document.querySelector('.popup-container');
    innerPopup.style.marginRight = '0';
  }, 50);

}

function closePopup() {
  const innerPopup = document.querySelector('.popup-container');
  innerPopup.style.marginRight = '-100%'; // Slide out to the right
  setTimeout(() => {
    const popupContainer = document.getElementById('showDetail-container');
    popupContainer.style.display = 'none';
  }, 300); // Adjust the timing to match your CSS transition
  delElement.removeEventListener('click', delHandler);
  editElement.removeEventListener('click', editHandler);
  displayTasks();
}

function stopPropagation(event) {
  event.stopPropagation();
}

function render_details(numberPart, textPart) {
  let task = tasks_board[0][textPart][numberPart];
  console.log(task);
  const cat = document.getElementById('cat')
  if (task.cat == "Techniker task") {
    console.log("techniker");
    cat.classList.add("techniker")
    cat.classList.add("task")
  }
  else {
    cat.classList.add("user")
    cat.classList.add("story")
  }
  cat.innerHTML = task.cat;
  document.getElementById('title').innerHTML = task.title;
  if (task.des == "")
    document.getElementById('des').classList.add('d-none');
  else {
    document.getElementById('des').classList.remove('d-none');
    document.getElementById('des').innerHTML = task.des;
  }
  document.getElementById('due').innerHTML = formatDate(task.due);
  if (task.prio == "") {
    document.getElementById('prio_popup').classList.add('d-none');
  }
  else {
    document.getElementById('prio_popup').classList.remove('d-none');
    document.getElementById('prio').innerHTML = task.prio.charAt(0).toUpperCase() + task.prio.slice(1);
    document.getElementById('prio_img').src = "./assets/img/" + task.prio + ".png";
  }
  if (task.ass_to.length != 0) {
    let initials = []
    for (let i = 0; i < task.ass_to.length; i++) {
      const ass = task.ass_to[i];
      for (let j = 0; j < users.length; j++) {
        const user = users[j];
        if (user['email'] == ass) {
          let name_parts = user['name'].split(" ");
          let firt_name = name_parts[0].charAt(0).toUpperCase();
          let second_name = "";
          if (name_parts.length > 1) {
            second_name = name_parts[name_parts.length - 1].charAt(0).toUpperCase();
          }
          initials.push({
            'initials': firt_name + second_name,
            'name': user['name'],
            'color': getUserColor(j),
          });
        }
      }
    }
    document.getElementById('ass_to_con').classList.remove('d-none')
    let ass_to = document.getElementById('ass_to');
    ass_to.innerHTML = '';
    for (let i = 0; i < task.ass_to.length; i++) {
      const ass = task.ass_to[i];
      ass_to.innerHTML += `
        <li class='list_element_ass_to'>
          <div class="inits" style="background-color: ${initials[i]['color']};">${initials[i]['initials']}</div>
          <div class="names">${initials[i]['name']}</div>
        </li>
      `
    }
  }
  else
    document.getElementById('ass_to_con').classList.add('d-none');
  console.log(task.sub_tasks.length)
  if (task.sub_tasks.length != 0) {
    document.getElementById('sub').classList.remove('d-none');
    document.getElementById('sub_head').classList.remove('d-none');
    let sub = document.getElementById('sub_list');
    sub.innerHTML = '';
    for (let i = 0; i < task.sub_tasks.length; i++) {
      const sub_task = task.sub_tasks[i];
      let sub_task_string = sub_task;
      if (sub_task.endsWith("_finished"))
        sub_task_string = sub_task_string.replace("_finished", "");
      sub.innerHTML += `
      <li onmouseout="not_hover_over_check(${i}, '${numberPart}', '${textPart}')" onmouseover="hover_over_check(${i}, '${numberPart}', '${textPart}')" class="list_element_sub_task" id="listelementsubtask_${i}" onclick="check(${i}, '${numberPart}', '${textPart}')">
        <img class="check_img" id='check_${i}' src="">
        <div class="list_text_sub_task">${sub_task_string}</div>
      </li>
      `
      setImg(i, numberPart, textPart);
    }
  }
  else {
    document.getElementById('sub').classList.add('d-none');
    document.getElementById('sub_head').classList.add('d-none');
  }
  delElement = document.getElementById('del');
  editElement = document.getElementById('edit');

  delHandler = createDelHandler(numberPart, textPart);
  editHandler = createEditHandler(numberPart, textPart);

  delElement.addEventListener('click', delHandler);
  editElement.addEventListener('click', editHandler);
}

var delElement, delHandler, editElement, editHandler;

function createDelHandler(numberPart, textPart) {
  return function delHandler() {
    del(numberPart, textPart);
  };
}

function createEditHandler(numberPart, textPart) {
  return function editHandler() {
    edit(numberPart, textPart);
  };
}


function formatDate(inputDate) {
  // Split the input date into parts
  const parts = inputDate.split("-");

  // Create a new Date object using the parts
  const formattedDate = new Date(parts[0], parts[1] - 1, parts[2]);

  // Get day, month, and year
  const day = formattedDate.getDate().toString().padStart(2, '0');
  const month = (formattedDate.getMonth() + 1).toString().padStart(2, '0');
  const year = formattedDate.getFullYear();

  // Return the formatted date
  return `${day}/${month}/${year}`;
}

function setImg(i, numberPart, textPart) {
  let task = tasks_board[0][textPart][numberPart];
  if (task.sub_tasks[i].endsWith("_finished")) {
    document.getElementById('check_' + i).src = "./assets/img/Check_button.png"
  }
  else {
    document.getElementById('check_' + i).src = "./assets/img/Check_button_unchecked.png"
  }
}

async function check(i, nb, text) {
  let task = tasks_board[0][text][nb];
  if (!task.sub_tasks[i].endsWith("_finished")) {
    task.sub_tasks[i] = task.sub_tasks[i] + "_finished";
    all_user['tasks'] = tasks_board;
    await setItem('users', all_user);
    document.getElementById("check_" + i).src = "./assets/img/Check_button.png"
  }
  else {
    task.sub_tasks[i] = task.sub_tasks[i].replace("_finished", "");
    all_user['tasks'] = tasks_board;
    await setItem('users', all_user);
    document.getElementById("check_" + i).src = "./assets/img/Check_button_unchecked.png"
  }
}

function not_hover_over_check(i, nb, text) {
  let task = tasks_board[0][text][nb];
  if (task.sub_tasks[i].endsWith("_finished")) {
    document.getElementById("check_" + i).src = "./assets/img/Check_button.png"
  }
  else {
    document.getElementById("check_" + i).src = "./assets/img/Check_button_unchecked.png"
  }
}

function hover_over_check(i, nb, text) {
  let task = tasks_board[0][text][nb];
  if (!task.sub_tasks[i].endsWith("_finished")) {
    document.getElementById("check_" + i).src = "./assets/img/Check_button.png"
  }
  else {
    document.getElementById("check_" + i).src = "./assets/img/Check_button_unchecked.png"
  }
}

async function search() {
  await load_users_tasks_board();
  let temp = searchTasks();
  tasks_board = temp[0];
  displayTasks();
}

function searchTasks() {
  let searchInput = document.getElementById('search_bar_input').value.toLowerCase();
  let searchResults = [];

  tasks_board.forEach((taskCategory, categoryName) => {
    let matchingTasks = {};

    Object.entries(taskCategory).forEach(([category, tasksArray]) => {
      let filteredTasks = tasksArray.filter((task) =>
        task.title.toLowerCase().includes(searchInput) || task.des.toLowerCase().includes(searchInput)
      );

      if (filteredTasks.length > 0) {
        matchingTasks[category] = filteredTasks;
      }
    });

    if (Object.keys(matchingTasks).length > 0) {
      searchResults.push({ [categoryName]: matchingTasks });
    }
  });

  return (searchResults);
}

async function del(numberPart, textPart) {
  tasks_board[0][textPart].splice(numberPart, 1);
  await set_tasks_board();
  await setItem('users', all_user);
  closePopup();
}

function edit(numberPart, textPart) {
  let task = tasks_board[0][textPart][numberPart];
  let popup_html = document.getElementById("popup-container");
  popup_html.innerHTML = "";
  popup_html.innerHTML = `
  <div class="edit_content">
    <div class="header_edit">
    <span class="close" onclick="closePopup()">×</span>
    </div>
    <div class="edit_head">Title</div>
    <input id="title_edit" type="text" required>
    <div class="edit_head">Description</div>
    <textarea class="description_input" placeholder="Enter a description" required id="description_input_edit"></textarea>
    <div class="edit_head">Due date</div>
    <input required type="date" id="date_input_edit">
    <div class="edit_head">Priority</div>
    <div class="prio">
      <div id="urgent_edit" class="prio_btns urgent" onclick="setPriority_edit('urgent')">
        <label>Urgent</label>
        <span><i class="fa-solid fa-angles-up"></i></span>
      </div>
      <div id="medium_edit" class="prio_btns medium" onclick="setPriority_edit('medium')">
        <label>Medium</label>
        <span><i class="fa-solid fa-equals"></i></span>
      </div>
      <div id="low_edit" class="prio_btns low" onclick="setPriority_edit('low')">
        <label>Low</label>
        <span><i class="fa-solid fa-angles-down"></i></span>
      </div>
    </div>
    <div class="edit_head">Assigned to</div>
<div class="contacts">
  <div class="contact-select date_picker" id="contactSelect_edit">
    <input
      class="select-box"
      onclick="toggleOptions_edit()"
      placeholder="Select contacts to assign"
    />
    <span><i class="fa-solid fa-angle-down icon"></i></span>
  </div>
  <div class="options-container" id="optionsContainer_edit"></div>
  </div>
  <div id="selected_cont_initials" class="selected_cont_initials inits_edit"></div>
<div class="edit_head">Subtasks</div>
<div class="date_picker" onclick="enterSubtasks_edit()">
  <input
    id="enter-subtask_edit"
    type="text"
    placeholder="Add new subtask"
  />
  <span id="add-subtask_edit" class="subtask">
    <i id="openAddTask_edit" class="fa-solid fa-plus"></i>
  </span>
  <span id="add-cancel-subtask_edit" class="add_cancel">
    <i
      onclick="clearInputField_edit()"
      id="delete-subtask_edit"
      class="fa-solid fa-xmark"
    ></i>
    <i
      id="confirm-subtask_edit"
      class="fa-solid fa-check"
      onclick="addSubtask_edit()"
    ></i>
  </span>
  </div>
  <ul id="subtaskList_edit" class="subtask-list added_subtasks_edit"></ul>
</div>
<div class="footer_edit">
  <img class="cancel_edit" src="./assets/img/board-img/Primary check button.png" onclick="finish_edit(${numberPart}, ${textPart})">
</div>
    `
  render_popup_edit(task);
}

let prio_edit;

function setPriority_edit(str) {
  prio_edit = str;
  if (prio_edit == 'urgent') {
    document.getElementById(prio_edit + "_edit").style.backgroundColor = 'red';
    document.getElementById("low_edit").style.backgroundColor = 'white';
    document.getElementById("medium_edit").style.backgroundColor = 'white';
  }
  if (prio_edit == 'medium') {
    document.getElementById(prio_edit + "_edit").style.backgroundColor = 'yellow';
    document.getElementById("urgent_edit").style.backgroundColor = 'white';
    document.getElementById("low_edit").style.backgroundColor = 'white';
  }
  if (prio_edit == 'low') {
    document.getElementById(prio_edit + "_edit").style.backgroundColor = 'green';
    document.getElementById("urgent_edit").style.backgroundColor = 'white';
    document.getElementById("medium_edit").style.backgroundColor = 'white';
  }
}

let ass_to_emails_edit;

function render_popup_edit(task) {
  console.log(task);
  document.getElementById('title_edit').value = task.title;
  document.getElementById('description_input_edit').value = task.des;
  document.getElementById('date_input_edit').value = task.due;
  if (task.prio == 'urgent')
    setPriority_edit('urgent')
  if (task.prio == 'medium')
    setPriority_edit('medium')
  if (task.prio == 'low')
    setPriority_edit('low')
  ass_to_emails_edit = task.ass_to;
  render_initialz_edit();
  contacts_edit();
  render_sub_tasks(task.sub_tasks);
}

function render_initialz_edit(){
  let initials = []
    for (let i = 0; i < ass_to_emails_edit.length; i++) {
      const ass = ass_to_emails_edit[i];
      for (let j = 0; j < users.length; j++) {
        const user = users[j];
        if (user['email'] == ass) {
          let name_parts = user['name'].split(" ");
          let firt_name = name_parts[0].charAt(0).toUpperCase();
          let second_name = "";
          if (name_parts.length > 1) {
            second_name = name_parts[name_parts.length - 1].charAt(0).toUpperCase();
          }
          initials.push({
            'initials': firt_name + second_name,
            'name': user['name'],
            'color': getUserColor(j),
          });
        }
      }
    }
    let html = document.getElementById('selected_cont_initials');
    html.innerHTML = ``;
    for (let i = 0; i < initials.length; i++) {
      const element = initials[i];
      html.innerHTML += `
      <div class="inits" style="background-color: ${element['color']};">${element['initials']}</div>
      `
    }
}//<div class="inits" style="background-color: #2ec5a4;">H</div>flex

function toggleOptions_edit() {
  const optionsContainer = document.getElementById("optionsContainer_edit");
  const toggleIcon = document.querySelector(".contact-select");
  toggleIcon.classList.toggle("active");
  optionsContainer.style.display =
    optionsContainer.style.display === "block" ? "none" : "block";
}


function toggleCheckbox_edit(index, nameInitials) {
  const checkbox = document.querySelector(
    `.option_edit[data-index="${index}"] .checkbox`
  );
  checkbox.checked = !checkbox.checked;

  const selectedContInitials = document.querySelector(
    ".selected_cont_initials"
  );

  if (checkbox.checked) {
    // Retrieve nameInitials from data attribute (falls dies benötigt wird)
    // const nameInitials = checkbox.getAttribute("data-name-initials");

    // Use span element with innerHTML
    const newSpan = document.createElement("span");
    ass_to_emails_edit.push(users[index]['email']);
  } else {
    const removedIndex = ass_to_emails_edit.findIndex((user) => user === users[index]['email']);
    if (removedIndex !== -1) {
      ass_to_emails_edit.splice(removedIndex, 1);
    }
    // Remove the corresponding span element for the unchecked checkbox
    const spans = document.querySelectorAll(".selected_cont_initials span");
    spans.forEach((span) => {
      if (span.innerText === nameInitials) {
        selectedContInitials.removeChild(span);
      }
    });
  }
  render_initialz_edit();
}

function contacts_edit() {
  const optionsContainer = document.getElementById("optionsContainer_edit");
  optionsContainer.innerHTML = "";

  for (let i = 0; i < users.length; i++) {
    const names = users[i].name.split(" ");
    let nameInitials = names[0].charAt(0).toUpperCase();
    nameInitials += names[names.length - 1].charAt(0).toUpperCase();
    const userColor = getUserColor(i);
    const isChecked = ass_to_emails_edit.includes(users[i]['email']); // Prüfe, ob die E-Mail-Adresse ausgewählt ist

    optionsContainer.innerHTML += `
        <div class="option_edit ${isChecked ? 'selected-contact' : ''}" data-index="${i}" onclick="addBackgroundColour_edit(${i}); toggleCheckbox_edit(${i})">
          <div class="c-name">
            <span class="name_initials" style="background-color: ${userColor}">${nameInitials}</span>
            <span>${users[i].name}</span>
          </div>
          <input type="checkbox" class="checkbox" data-name-initials="${nameInitials}" ${isChecked ? 'checked' : ''}>
        </div>`;
  }
}

function addBackgroundColour_edit(i) {
  const selectedContact = document.querySelector(`.option_edit[data-index="${i}"]`);
  if (selectedContact) {
    selectedContact.classList.toggle("selected-contact");
  }
}

function render_sub_tasks(sub_tasks) {
  const ul = document.getElementById("subtaskList_edit");
  ul.innerHTML = ""; // Clear previous content

  for (const sub_task of sub_tasks) {
    const li = document.createElement("li");
    li.innerHTML += addTaskHTML(sub_task);
    ul.appendChild(li);
  }
}

async function finish_edit(numberPart, textPart){
  console.log(numberPart, textPart);
  let task = tasks_board[0][textPart][numberPart];
  task.title = document.getElementById('title_edit').value;
  task.due = document.getElementById('date_input_edit').value;
  task.ass_to = ass_to_emails_edit;
  task.des = document.getElementById('description_input_edit').value
  task.prio = prio_edit;

}