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
      tasks_board = element['tasks'];
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
  const todo = document.getElementById("taskCategoryToDo");
  const inProgress = document.getElementById("taskCategoryInProgress");
  const awaitFeedback = document.getElementById("taskCategoryAwaitFeedback");
  const done = document.getElementById("taskCategoryDone");
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
        const taskHTML = generateTaskHTML(task, status);
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

function generateTaskHTML(task, status) {
  let html = `
    <div class="user_task">
      <div class="user_story ${task.cat.toLowerCase()}">${task.cat}</div>
      <div class="user_topic">
        <h4>${task.title}</h4>
        <p>${task.des}</p>
      </div>`;

  if (status === "in_progress") {
    html += `
      <div class="task_progress">
        <div class="progress">
          <div class="progressbar" style="width: 50%"></div>
        </div>
        <div class="subtasks">${task.sub_tasks.length}/2 Subtasks</div>
      </div>`;
  }

  if (status === "feedback") {
    html += `
      <div class="task_progress">
        <div class="progress">
          <div class="progressbar d-none" style="width: 0%"></div>
        </div>
        <div class="subtasks d-none">${task.sub_tasks.length}/2 Subtasks</div>
      </div>`;
  }

  if (status === "done") {
    html += `
      <div class="task_progress">
        <div class="progress">
          <div class="progressbar" style="width: 100%"></div>
        </div>
        <div class="subtasks">2/2 Subtasks</div>
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
