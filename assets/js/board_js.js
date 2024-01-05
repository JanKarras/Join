let tasksBoard = []; //Array of all tasks that should be display in the board

/**
 * Initializes the board by loading user contacts and tasks, displaying contacts, and rendering tasks on the board.
 */
async function boardInit() {
  await loadUsersContacts();
  await loadUserstasksBoard();
  contacts();
  displayTasks();
}

/**
 * Loads user tasks for the board by copying them from the user's 'tasks' array.
 */
async function loadUserstasksBoard() {
  tasksBoard.length = 0;
  for (let i = 0; i < allUser.length; i++) {
    const element = allUser[i];
    if (element['email'] == Email) {
      tasksBoard = element['tasks'].slice();
      break;
    }
  }
}

/**
 * Opens the add task window, initializes the task, and displays the window with an overlay.
 *
 * @param {string} name - The name parameter for task initialization.
 */
function openAddTask(name) {
  add_task_init(name);
  let addTask = document.getElementById("addTaskPopUpWindowContent");
  let overlay = document.querySelector(".overlay");
  addTask.classList.remove("d-none");
  overlay.classList.remove("d-none");
  addTask.style.left = "50%"
}

/**
 * Closes the add task window and hides the overlay.
 */
function closeAddTask() {
  let addTask = document.getElementById("addTaskPopUpWindowContent");
  let overlay = document.querySelector(".overlay");
  addTask.classList.add("d-none");
  overlay.classList.add("d-none");
}

/**
 * Display tasks on the HTML page based on the tasksBoard data.
 */
function displayTasks() {
  const todo = document.getElementById("todo");
  const inProgress = document.getElementById("in_progress");
  const awaitFeedback = document.getElementById("feedback");
  const done = document.getElementById("done");
  clearTaskContainers(todo, inProgress, awaitFeedback, done);
  displayNoTaskMessage(todo, tasksBoard[0]['todo'], "No tasks to do");
  displayNoTaskMessage(inProgress, tasksBoard[0]['in_progress'], "No tasks in progress");
  displayNoTaskMessage(awaitFeedback, tasksBoard[0]['feedback'], "No tasks waiting for feedback");
  displayNoTaskMessage(done, tasksBoard[0]['done'], "No tasks done");
  for (const status in tasksBoard[0]) {
    if (tasksBoard[0].hasOwnProperty(status)) {
      const tasksInStatus = tasksBoard[0][status];
      displayTasksInStatus(status, tasksInStatus);
    }
  }
}

/**
 * Clear the content of task containers.
 *
 * @param {HTMLElement} todo - The todo container element.
 * @param {HTMLElement} inProgress - The in-progress container element.
 * @param {HTMLElement} awaitFeedback - The feedback container element.
 * @param {HTMLElement} done - The done container element.
 */
function clearTaskContainers(todo, inProgress, awaitFeedback, done) {
  todo.innerHTML = "";
  inProgress.innerHTML = "";
  awaitFeedback.innerHTML = "";
  done.innerHTML = "";
}

/**
 * Display a message in the task container if there are no tasks in the specified category.
 *
 * @param {HTMLElement} container - The task container element.
 * @param {Array} tasks - The array of tasks in the specified category.
 * @param {string} message - The message to display if there are no tasks.
 */
function displayNoTaskMessage(container, tasks, message) {
  if (tasks && tasks.length === 0) {
    container.innerHTML = `<div class='notask'>${message}</div>`;
  }
}

/**
 * Display tasks in the specified status category.
 *
 * @param {string} status - The status category (e.g., "todo", "in_progress").
 * @param {Array} tasksInStatus - The array of tasks in the specified status category.
 */
function displayTasksInStatus(status, tasksInStatus) {
  const container = document.getElementById(status);
  for (let i = 0; i < tasksInStatus.length; i++) {
    const task = tasksInStatus[i];
    const taskHTML = generateTaskHTML(task, status, i);
    container.innerHTML += taskHTML;
  }
}

/**
 * Generates HTML markup for a task based on task data, status, and index.
 *
 * @param {object} task - The task object containing details.
 * @param {string} status - The status of the task (e.g., "todo", "in_progress").
 * @param {number} index - The index of the task.
 * @returns {string} - HTML markup for the task.
 */
function generateTaskHTML(task, status, index) {
  const taskId = generateTaskId(status, index);
  let html = createTaskHTMLStructure(task, taskId);
  if (task.sub_tasks.length !== 0) {
    html += createSubtasksHTML(task, status);
  }
  if (task.ass_to.length !== 0) {
    html += createUserAssignmentsHTML(task);
  }
  return html;
}

/**
 * Generates a unique task ID based on status and index.
 *
 * @param {string} status - The status of the task (e.g., "todo", "in_progress").
 * @param {number} index - The index of the task.
 * @returns {string} - The unique task ID.
 */
function generateTaskId(status, index) {
  return `${status}_${index}`;
}

/**
 * Creates the basic HTML structure for a task.
 *
 * @param {object} task - The task object containing details.
 * @param {string} taskId - The unique task ID.
 * @returns {string} - HTML markup for the task structure.
 */
function createTaskHTMLStructure(task, taskId) {
  return `
    <div class="user_task" draggable="true" ondragstart="drag(event)" data-task-id="${taskId}" onclick="showDetail('${taskId}')">
      <div class="user_story ${task.cat.toLowerCase()}">${task.cat}</div>
      <div class="user_topic">
        <h4>${task.title}</h4>
        <p>${task.des}</p>
      </div>`;
}

/**
 * Creates HTML markup for subtasks, including progress bar.
 *
 * @param {object} task - The task object containing details.
 * @param {string} status - The status of the task (e.g., "todo", "in_progress").
 * @param {string} taskId - The unique task ID.
 * @returns {string} - HTML markup for subtasks.
 */
function createSubtasksHTML(task, status, taskId) {
  let progressWidth = calculateSubtaskProgress(task);
  const subtasksVisible = status !== "done" ? "" : "d-none";
  const progressWidthPercent = (progressWidth / task.sub_tasks.length) * 100;
  return `
    <div class="task_progress" draggable="true" ondragstart="drag(event)" data-task-id="${taskId}">
      <div class="progress">
        <div class="progressbar" style="width: ${progressWidthPercent}%"></div>
      </div>
      <div class="subtasks ${subtasksVisible}">${progressWidth}/${task.sub_tasks.length} Subtasks</div>
    </div>`;
}

/**
 * Calculates the progress width for subtasks based on completion.
 *
 * @param {object} task - The task object containing details.
 * @returns {number} - The width of the progress bar based on subtask completion.
 */
function calculateSubtaskProgress(task) {
  let progressWidth = 0;
  for (let i = 0; i < task.sub_tasks.length; i++) {
    const subtask = task.sub_tasks[i];
    if (subtask.endsWith("_finished")) {
      progressWidth++;
    }
  }
  return progressWidth;
}

/**
 * Creates HTML markup for user assignments, including initials and priority icon.
 *
 * @param {object} task - The task object containing details.
 * @returns {string} - HTML markup for user assignments.
 */
function createUserAssignmentsHTML(task) {
  const initials = getAssigneeInitials(task);
  let html = `<div class="user_assignment"><div class="members">`;
  for (let i = 0; i < initials.length; i++) {
    const inizial = initials[i]['initials'];
    const color = initials[i]['color'];
    html += `<div class="inits_board" style="background-color: ${color};">${inizial}</div>`;
  }
  if (task.prio && task.prio.length !== 0) {
    html += `</div><span><img src="assets/img/${task.prio.toLowerCase()}.png" alt="" /></span></div>`;
  } else {
    html += `</div>`;
  }
  return html;
}

/**
 * Retrieves initials and color for assigned users.
 *
 * @param {object} task - The task object containing details.
 * @returns {Array} - An array of objects containing user initials and color.
 */
function getAssigneeInitials(task) {
  const initials = [];
  for (let i = 0; i < task.ass_to.length; i++) {
    const ass = task.ass_to[i];
    for (let j = 0; j < users.length; j++) {
      const user = users[j];
      if (user['email'] === ass) {
        const name_parts = user['name'].split(" ");
        const first_name = name_parts[0].charAt(0).toUpperCase();
        let second_name = "";
        if (name_parts.length > 1) {
          second_name = name_parts[name_parts.length - 1].charAt(0).toUpperCase();
        }
        initials.push({
          'initials': first_name + second_name,
          'color': getUserColor(j),
        });
      }
    }
  }
  return initials;
}

/**
 * Allows dropping of draggable elements by preventing the default behavior of the drop event.
 *
 * @param {Event} event - The drop event.
 */
function allowDrop(event) {
  event.preventDefault();
}

/**
 * Initiates the drag operation by setting the task ID as data to be transferred during dragging.
 *
 * @param {DragEvent} event - The drag event.
 */
function drag(event) {
  // Übergebe die Task-ID während des Dragging
  const taskId = event.currentTarget.getAttribute("data-task-id");
  event.dataTransfer.setData("text/plain", taskId);
}

/**
 * Handles the drop event by preventing the default behavior, retrieving the task ID and drop category ID,
 * and invoking the 'dropped' function with the extracted values.
 *
 * @param {DragEvent} event - The drop event.
 */
function drop(event) {
  event.preventDefault();
  const taskId = event.dataTransfer.getData("text/plain");
  const dropCategoryId = event.target.closest('.taskCategory').id;
  dropped(taskId, dropCategoryId);
}

/**
 * Handles the dropped event by moving a task from one category to another.
 * Updates the 'tasksBoard' array, sets it to storage, updates user data, and refreshes the displayed tasks.
 *
 * @param {string} taskId - The ID of the task being dragged.
 * @param {string} dropCategoryId - The ID of the category where the task is dropped.
 */
async function dropped(taskId, dropCategoryId) {
  const lastUnderscoreIndex = taskId.lastIndexOf('_');
  const numberPart = taskId.substring(lastUnderscoreIndex + 1);
  const textPart = taskId.substring(0, lastUnderscoreIndex);
  (numberPart)
  (textPart)
  tasksBoard[0][dropCategoryId].push(tasksBoard[0][textPart][numberPart])
  tasksBoard[0][textPart].splice(numberPart, 1);
  await setTasksBoard();
  await setItem('users', allUser);
  displayTasks();
}

/**
 * Sets the 'tasksBoard' array in the current user's data.
 */
async function setTasksBoard() {
  for (let i = 0; i < allUser.length; i++) {
    const user = allUser[i];
    if (user['email'] == Email) {
      user['tasks'] = tasksBoard;
      break;
    }
  }
}

/**
 * Shows the details of a task identified by its taskId.
 *
 * @param {string} taskId - The ID of the task for which details are to be displayed.
 */
async function showDetail(taskId) {
  const lastUnderscoreIndex = taskId.lastIndexOf('_');
  const numberPart = taskId.substring(lastUnderscoreIndex + 1);
  const textPart = taskId.substring(0, lastUnderscoreIndex);
  (numberPart, textPart);
  await openPopup();
  render_details(numberPart, textPart);
}

/**
 * Opens the details popup by displaying it and applying a sliding-in animation from the right.
 */
async function openPopup() {
  const popupContainer = document.getElementById('showDetail-container');
  popupContainer.style.display = 'block';

  // Animate the popup sliding in from the right
  setTimeout(() => {
    const innerPopup = document.querySelector('.popup-container');
    innerPopup.style.marginRight = '0';
  }, 50);
}

/**
 * Closes the details popup by sliding it out to the right and hiding it after the animation.
 */
function closePopup() {
  const innerPopup = document.querySelector('.popup-container');
  innerPopup.style.marginRight = '-100%'; // Slide out to the right
  setTimeout(() => {
    const popupContainer = document.getElementById('showDetail-container');
    popupContainer.style.display = 'none';
  }, 300); // Adjust the timing to match your CSS transition
  delElement.removeEventListener('click', delHandler);
  editElement.removeEventListener('click', editHandler);
  document.getElementById('edit_container').classList.add('d-none')
  document.getElementById('popup-container').classList.remove('d-none')
  displayTasks();
}

/**
 * Stops the propagation of the given event to prevent it from reaching parent elements.
 *
 * @param {Event} event - The event for which propagation should be stopped.
 */
function stopPropagation(event) {
  event.stopPropagation();
}

/**
 * Renders the details of a task using the provided task information.
 *
 * @param {string} numberPart - The numerical part of the task ID.
 * @param {string} textPart - The text part of the task ID.
 */
function render_details(numberPart, textPart) {
  let task = tasksBoard[0][textPart][numberPart];
  (task);
  const cat = document.getElementById('cat')
  if (task.cat == "Techniker task") {
    ("techniker");
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
    if (task.prio) {
      document.getElementById('prio_popup').classList.remove('d-none');
      document.getElementById('prio').innerHTML = task.prio.charAt(0).toUpperCase() + task.prio.slice(1);
      document.getElementById('prio_img').src = "./assets/img/" + task.prio + ".png";
    }
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
    if (initials.length == 0) {
      for (let i = 0; i < task.ass_to.length; i++) {
        initials.push({
          'initials': 'GG',
          'name': 'guest',
          'color': getUserColor(i),
        });
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
  (task.sub_tasks.length)
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
      <li onmouseout="notHoverOverCheck(${i}, '${numberPart}', '${textPart}')" onmouseover="hoverOverCheck(${i}, '${numberPart}', '${textPart}')" class="list_element_sub_task" id="listelementsubtask_${i}" onclick="check(${i}, '${numberPart}', '${textPart}')">
        <img class="check_img" id='check_${i}' src="">
        <div class="list_text_sub_task hover_pointer">${sub_task_string}</div>
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

/**
 * Creates a delete event handler function for a specific task identified by its number and text parts.
 *
 * @param {string} numberPart - The numerical part of the task ID.
 * @param {string} textPart - The text part of the task ID.
 * @returns {Function} - The delete event handler function.
 */
function createDelHandler(numberPart, textPart) {
  return function delHandler() {
    del(numberPart, textPart);
  };
}

/**
 * Creates an edit event handler function for a specific task identified by its number and text parts.
 *
 * @param {string} numberPart - The numerical part of the task ID.
 * @param {string} textPart - The text part of the task ID.
 * @returns {Function} - The edit event handler function.
 */
function createEditHandler(numberPart, textPart) {
  return function editHandler() {
    edit(numberPart, textPart);
  };
}

/**
 * Formats the input date in the "DD/MM/YYYY" format.
 *
 * @param {string} inputDate - The input date in the "YYYY-MM-DD" format.
 * @returns {string} - The formatted date in the "DD/MM/YYYY" format.
 */
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

/**
 * Sets the image source for the checkbox based on the completion status of a subtask.
 *
 * @param {number} i - The index of the subtask.
 * @param {string} numberPart - The numerical part of the task ID.
 * @param {string} textPart - The text part of the task ID.
 */
function setImg(i, numberPart, textPart) {
  let task = tasksBoard[0][textPart][numberPart];
  if (task.sub_tasks[i].endsWith("_finished")) {
    document.getElementById('check_' + i).src = "./assets/img/Check_button.png"
  }
  else {
    document.getElementById('check_' + i).src = "./assets/img/Check_button_unchecked.png"
  }
}

/**
 * Handles the completion status of a subtask and updates the user's tasks accordingly.
 *
 * @param {number} i - The index of the subtask.
 * @param {string} nb - The numerical part of the task ID.
 * @param {string} text - The text part of the task ID.
 */
async function check(i, nb, text) {
  let task = tasksBoard[0][text][nb];
  if (!task.sub_tasks[i].endsWith("_finished")) {
    task.sub_tasks[i] = task.sub_tasks[i] + "_finished";
    allUser['tasks'] = tasksBoard;
    await setItem('users', allUser);
    document.getElementById("check_" + i).src = "./assets/img/Check_button.png"
  }
  else {
    task.sub_tasks[i] = task.sub_tasks[i].replace("_finished", "");
    allUser['tasks'] = tasksBoard;
    await setItem('users', allUser);
    document.getElementById("check_" + i).src = "./assets/img/Check_button_unchecked.png"
  }
}

/**
 * Handles the appearance of the checkbox when not hovered over a subtask.
 *
 * @param {number} i - The index of the subtask.
 * @param {string} nb - The numerical part of the task ID.
 * @param {string} text - The text part of the task ID.
 */
function notHoverOverCheck(i, nb, text) {
  let task = tasksBoard[0][text][nb];
  if (task.sub_tasks[i].endsWith("_finished")) {
    document.getElementById("check_" + i).src = "./assets/img/Check_button.png"
  }
  else {
    document.getElementById("check_" + i).src = "./assets/img/Check_button_unchecked.png"
  }
}

/**
 * Handles the appearance of the checkbox when hovered over a subtask.
 *
 * @param {number} i - The index of the subtask.
 * @param {string} nb - The numerical part of the task ID.
 * @param {string} text - The text part of the task ID.
 */
function hoverOverCheck(i, nb, text) {
  let task = tasksBoard[0][text][nb];
  if (!task.sub_tasks[i].endsWith("_finished")) {
    document.getElementById("check_" + i).src = "./assets/img/Check_button.png"
  }
  else {
    document.getElementById("check_" + i).src = "./assets/img/Check_button_unchecked.png"
  }
}

/**
 * Asynchronously searches for tasks and updates the display.
 * 
 * Calls the 'loadUserstasksBoard' function to ensure the tasks are up-to-date,
 * then performs a search using the 'searchTasks' function, updates the 'tasksBoard'
 * accordingly, and finally updates the display by calling 'displayTasks'.
 */
async function search() {
  await loadUserstasksBoard();
  let temp = searchTasks();
  tasksBoard = temp[0];
  (tasksBoard)
  displayTasks();
}

/**
 * Searches for tasks based on the input value in the search bar.
 *
 * Retrieves the search input value, iterates through task categories,
 * and filters tasks that match the search criteria (title or description).
 * Constructs an array of search results organized by task categories.
 *
 * @returns {Array} - An array containing the search results organized by task categories.
 */
function searchTasks() {
  let searchInput = document.getElementById('search_bar_input').value.toLowerCase();
  let searchResults = [];
  tasksBoard.forEach((taskCategory, categoryName) => {
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
  (searchResults);
  return (searchResults);
}

/**
 * Asynchronously deletes a task from the 'tasksBoard'.
 * 
 * Removes the task from the specified category and updates the data in 'tasksBoard',
 * then saves the updated data to local storage and closes the task details popup.
 * 
 * @param {number} numberPart - The index of the task within its category.
 * @param {string} textPart - The category to which the task belongs.
 */
async function del(numberPart, textPart) {
  tasksBoard[0][textPart].splice(numberPart, 1);
  await setTasksBoard();
  await setItem('users', allUser);
  closePopup();
}

/**
 * Opens the edit popup for a task.
 * 
 * Retrieves the task details, displays the edit popup, and populates it with the task information.
 * 
 * @param {number} numberPart - The index of the task within its category.
 * @param {string} textPart - The category to which the task belongs.
 */
function edit(numberPart, textPart) {
  let task = tasksBoard[0][textPart][numberPart];
  document.getElementById("popup-container").classList.add('d-none');
  let popup_html = document.getElementById("edit_container");
  popup_html.classList.remove('d-none');
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
      <div id="urgent_edit" class="prio_btns urgent" onclick="setPriorityEdit('urgent')">
        <label>Urgent</label>
        <span><i class="fa-solid fa-angles-up"></i></span>
      </div>
      <div id="medium_edit" class="prio_btns medium" onclick="setPriorityEdit('medium')">
        <label>Medium</label>
        <span><i class="fa-solid fa-equals"></i></span>
      </div>
      <div id="low_edit" class="prio_btns low" onclick="setPriorityEdit('low')">
        <label>Low</label>
        <span><i class="fa-solid fa-angles-down"></i></span>
      </div>
    </div>
    <div class="edit_head">Assigned to</div>
<div class="contacts">
  <div class="contact-select date_picker" id="contactSelect_edit">
    <input
      class="select-box"
      onclick="toggleOptionsEdit()"
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
  <img class="cancel_edit hover_pointer" src="./assets/img/board-img/Primary check button.png" onclick="finishEdit(${numberPart}, '${textPart}')">
</div>
    `
  renderPopupEdit(task);
}

let prio_edit; //prio of the task the user wants to edit

/**
 * Sets the priority for editing a task.
 * 
 * Updates the priority_edit variable based on the selected priority and adjusts the styling
 * of priority buttons accordingly in the edit popup.
 * 
 * @param {string} str - The selected priority ('urgent', 'medium', or 'low').
 */
function setPriorityEdit(str) {
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

let assToEmails_edit;

/**
 * Renders the content of the edit popup based on the provided task.
 * 
 * @param {Object} task - The task object containing details such as title, description, due date, etc.
 */
function renderPopupEdit(task) {
  (task);
  document.getElementById('title_edit').value = task.title;
  document.getElementById('description_input_edit').value = task.des;
  document.getElementById('date_input_edit').value = task.due;
  if (task.prio == 'urgent')
    setPriorityEdit('urgent')
  if (task.prio == 'medium')
    setPriorityEdit('medium')
  if (task.prio == 'low')
    setPriorityEdit('low')
  assToEmails_edit = task.ass_to;
  renderInitialsEdit();
  contactsEdit();
  renderSubTasks(task.sub_tasks);
}

/**
 * Renders the initials for assigned contacts in the edit popup.
 */
function renderInitialsEdit() {
  let initials = []
  for (let i = 0; i < assToEmails_edit.length; i++) {
    const ass = assToEmails_edit[i];
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

/**
 * Toggles the display of contact options in the edit popup.
 */
function toggleOptionsEdit() {
  const optionsContainer = document.getElementById("optionsContainer_edit");
  const toggleIcon = document.querySelector(".contact-select");
  toggleIcon.classList.toggle("active");
  optionsContainer.style.display =
    optionsContainer.style.display === "block" ? "none" : "block";
}

/**
 * Toggles the state of a checkbox and updates the selected initials display.
 *
 * @param {number} index - The index of the user in the users array.
 * @param {string} nameInitials - The initials of the user.
 */
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
    assToEmails_edit.push(users[index]['email']);
  } else {
    const removedIndex = assToEmails_edit.findIndex((user) => user === users[index]['email']);
    if (removedIndex !== -1) {
      assToEmails_edit.splice(removedIndex, 1);
    }
    // Remove the corresponding span element for the unchecked checkbox
    const spans = document.querySelectorAll(".selected_cont_initials span");
    spans.forEach((span) => {
      if (span.innerText === nameInitials) {
        selectedContInitials.removeChild(span);
      }
    });
  }
  renderInitialsEdit();
}

/**
 * Populates the optionsContainer_edit with user options for assigning tasks.
 */
function contactsEdit() {
  const optionsContainer = document.getElementById("optionsContainer_edit");
  optionsContainer.innerHTML = "";
  for (let i = 0; i < users.length; i++) {
    const names = users[i].name.split(" ");
    let nameInitials = names[0].charAt(0).toUpperCase();
    nameInitials += names[names.length - 1].charAt(0).toUpperCase();
    const userColor = getUserColor(i);
    const isChecked = assToEmails_edit.includes(users[i]['email']); // Prüfe, ob die E-Mail-Adresse ausgewählt ist
    optionsContainer.innerHTML += `
        <div class="option_edit ${isChecked ? 'selected-contact' : ''}" data-index="${i}" onclick="addBackgroundColourEdit(${i}); toggleCheckbox_edit(${i})">
          <div class="c-name">
            <span class="name_initials" style="background-color: ${userColor}">${nameInitials}</span>
            <span>${users[i].name}</span>
          </div>
          <input type="checkbox" class="checkbox" data-name-initials="${nameInitials}" ${isChecked ? 'checked' : ''}>
        </div>`;
  }
}

/**
 * Toggles the 'selected-contact' class to add or remove background color for the selected contact.
 * @param {number} i - The index of the contact.
 */
function addBackgroundColourEdit(i) {
  const selectedContact = document.querySelector(`.option_edit[data-index="${i}"]`);
  if (selectedContact) {
    selectedContact.classList.toggle("selected-contact");
  }
}

/**
 * Renders the subtasks in the popup's subtask list.
 * @param {Array} sub_tasks - An array of subtasks to be rendered.
 */
function renderSubTasks(sub_tasks) {
  const ul = document.getElementById("subtaskList_edit");
  ul.innerHTML = ""; // Clear previous content
  for (const sub_task of sub_tasks) {
    const li = document.createElement("li");
    li.innerHTML += addTaskHTML(sub_task);
    ul.appendChild(li);
  }
}

/**
 * Finishes the editing process, updates the task details, and closes the popup.
 * @param {number} numberPart - The index of the task within its category.
 * @param {string} textPart - The category of the task (e.g., 'todo', 'in_progress', etc.).
 */
async function finishEdit(numberPart, textPart) {
  (numberPart, textPart);
  let task = tasksBoard[0][textPart][numberPart];
  task.title = document.getElementById('title_edit').value;
  task.due = document.getElementById('date_input_edit').value;
  task.ass_to = assToEmails_edit;
  task.des = document.getElementById('description_input_edit').value
  task.prio = prio_edit;
  closePopup();
}