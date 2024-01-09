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
  add_taskInit(name);
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
  tasksBoard[0][dropCategoryId].push(tasksBoard[0][textPart][numberPart])
  tasksBoard[0][textPart].splice(numberPart, 1);
  await setTasksBoard();
  await sendChangeToAllUser(textPart, numberPart , dropCategoryId);
  await setItem('users', allUser);
  displayTasks();
}

/**
 * Sends changes to all users based on the specified parameters.
 * @param {string} textPart - The text part.
 * @param {number} numberPart - The numeric part.
 * @param {string} dropCategoryId - The drop category ID.
 */
async function sendChangeToAllUser(textPart, numberPart, dropCategoryId){
  let emails = tasksBoard[0][dropCategoryId][tasksBoard[0][dropCategoryId].length - 1].ass_to;
  for (let i = 0; i < allUser.length; i++) {
    const user = allUser[i];
    for (let j = 0; j < emails.length; j++) {
      const email = emails[j];
      if (user.email == email){
        if (email != Email){
          user.tasks[0][dropCategoryId].push(tasksBoard[0][dropCategoryId][tasksBoard[0][dropCategoryId].length - 1]);
          for (let k = 0; k < user.tasks[0][textPart].length; k++) {
            const element = user.tasks[0][textPart][k];
            if (JSON.stringify(element) === JSON.stringify(tasksBoard[0][dropCategoryId][tasksBoard[0][dropCategoryId].length - 1])){
              user.tasks[0][textPart].splice(k , 1);
            }
          }
        }
      }
    }
  }
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
