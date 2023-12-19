let tasks_board = [];

async function board_init() {
  await load_users_contacts();
  await load_users_tasks_board();
  contacts();
  displayTasks();
}

async function load_users_tasks_board(){
  tasks_board.length = 0;
  for (let i = 0; i < all_user.length; i++) {
    const element = all_user[i];
    if (element['email'] == Email) {
      tasks_board = element['tasks'].slice();
      break ; 
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
    <div class="user_task" draggable="true" ondragstart="drag(event)" data-task-id="${taskId}">
      <div class="user_story ${task.cat.toLowerCase()}">${task.cat}</div>
      <div class="user_topic">
        <h4>${task.title}</h4>
        <p>${task.des}</p>
      </div>`;

  if (status === "in_progress" || status === "feedback" || status === "done") {
    const progressWidth = status === "in_progress" ? "50%" : (status === "done" ? "100%" : "0%");
    const subtasksVisible = status !== "done" ? "" : "d-none";

    html += `
      <div class="task_progress" draggable="true" ondragstart="drag(event)" data-task-id="${taskId}">
        <div class="progress">
          <div class="progressbar" style="width: ${progressWidth}"></div>
        </div>
        <div class="subtasks ${subtasksVisible}">${task.sub_tasks.length}/2 Subtasks</div>
      </div>`;
  }

  html += `
    <div class="user_assignment">
      <div class="members">${task.ass_to
        .map((member) => `<div>${member}</div>`)
        .join("")}</div>
      <span><img src="assets/img/${task.prio.toLowerCase()}.png" alt="" /></span>
    </div>
  </div>`;

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

async function dropped(taskId, dropCategoryId){
  console.log(taskId, dropCategoryId);
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

async function set_tasks_board(){
  for (let i = 0; i < all_user.length; i++) {
    const user = all_user[i];
    if (user['email'] == Email)
    {
      user['tasks'] = tasks_board;
      break;
    }
  }
}