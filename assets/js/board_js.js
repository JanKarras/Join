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
    if (element["email"] == Email) {
      tasks_board = element["tasks"].slice();
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

  // Loop through each task status (to_do, in_progress, feedback, done)
  for (const status in tasks_board[0])
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
    let progressWidth = 0;
    letprogressWidthpercent = 0;
    const subtasksVisible = status !== "done" ? "" : "d-none";
    for (let i = 0; i < task.sub_tasks.length; i++) {
      const subtask = task.sub_tasks[i];
      if (subtask.endsWith("_finished")) progressWidth++;
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
  const dropCategoryId = event.target.closest(".taskCategory").id;
  dropped(taskId, dropCategoryId);
}

async function dropped(taskId, dropCategoryId) {
  const lastUnderscoreIndex = taskId.lastIndexOf("_");
  const numberPart = taskId.substring(lastUnderscoreIndex + 1);
  const textPart = taskId.substring(0, lastUnderscoreIndex);
  console.log(numberPart);
  console.log(textPart);
  tasks_board[0][dropCategoryId].push(tasks_board[0][textPart][numberPart]);
  tasks_board[0][textPart].splice(numberPart, 1);
  await set_tasks_board();
  await setItem("users", all_user);
  displayTasks();
}

async function set_tasks_board() {
  for (let i = 0; i < all_user.length; i++) {
    const user = all_user[i];
    if (user["email"] == Email) {
      user["tasks"] = tasks_board;
      break;
    }
  }
}

async function showDetail(taskId) {
  const lastUnderscoreIndex = taskId.lastIndexOf("_");
  const numberPart = taskId.substring(lastUnderscoreIndex + 1);
  const textPart = taskId.substring(0, lastUnderscoreIndex);
  console.log(numberPart, textPart);
  await openPopup();
  render_details(numberPart, textPart);
}

async function openPopup() {
  const popupContainer = document.getElementById("showDetail-container");
  popupContainer.style.display = "block";

  // Animate the popup sliding in from the right
  setTimeout(() => {
    const innerPopup = document.querySelector(".popup-container");
    innerPopup.style.marginRight = "0";
  }, 50);
}

function closePopup() {
  const innerPopup = document.querySelector(".popup-container");
  innerPopup.style.marginRight = "-100%"; // Slide out to the right
  setTimeout(() => {
    const popupContainer = document.getElementById("showDetail-container");
    popupContainer.style.display = "none";
  }, 300); // Adjust the timing to match your CSS transition
  displayTasks();
}

function stopPropagation(event) {
  event.stopPropagation();
}

function render_details(numberPart, textPart) {
  let task = tasks_board[0][textPart][numberPart];
  console.log(task);
  const cat = document.getElementById("cat");
  if (task.cat == "Techniker task") {
    console.log("techniker");
    cat.classList.add("techniker");
    cat.classList.add("task");
  } else {
    cat.classList.add("user");
    cat.classList.add("story");
  }
  cat.innerHTML = task.cat;
  document.getElementById("title").innerHTML = task.title;
  if (task.des == "") document.getElementById("des").classList.add("d-none");
  else {
    document.getElementById("des").classList.remove("d-none");
    document.getElementById("des").innerHTML = task.des;
  }
  document.getElementById("due").innerHTML = formatDate(task.due);
  if (task.prio == "") {
    document.getElementById("prio_popup").classList.add("d-none");
  } else {
    document.getElementById("prio_popup").classList.remove("d-none");
    document.getElementById("prio").innerHTML =
      task.prio.charAt(0).toUpperCase() + task.prio.slice(1);
    document.getElementById("prio_img").src =
      "./assets/img/" + task.prio + ".png";
  }
  if (task.ass_to.length != 0) {
    let initials = [];
    for (let i = 0; i < task.ass_to.length; i++) {
      const ass = task.ass_to[i];
      for (let j = 0; j < users.length; j++) {
        const user = users[j];
        if (user["email"] == ass) {
          let name_parts = user["name"].split(" ");
          let firt_name = name_parts[0].charAt(0).toUpperCase();
          let second_name = "";
          if (name_parts.length > 1) {
            second_name = name_parts[name_parts.length - 1]
              .charAt(0)
              .toUpperCase();
          }
          initials.push({
            initials: firt_name + second_name,
            name: user["name"],
          });
        }
      }
    }
    console.log(initials);
    document.getElementById("ass_to_con").classList.remove("d-none");
    let ass_to = document.getElementById("ass_to");
    ass_to.innerHTML = "";
    for (let i = 0; i < task.ass_to.length; i++) {
      const ass = task.ass_to[i];
      ass_to.innerHTML += `
        <li class='list_element_ass_to'>
          <div class="inits">${initials[i]["initials"]}</div>
          <div class="names">${initials[i]["name"]}</div>
        </li>
      `;
    }
  } else document.getElementById("ass_to_con").classList.add("d-none");
  console.log(task.sub_tasks.length);
  if (task.sub_tasks.length != 0) {
    document.getElementById("sub").classList.remove("d-none");
    let sub = document.getElementById("sub_list");
    sub.innerHTML = "";
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
      `;
      setImg(i, numberPart, textPart);
    }
  } else document.getElementById("sub").classList.add("d-none");
}

function formatDate(inputDate) {
  // Split the input date into parts
  const parts = inputDate.split("-");

  // Create a new Date object using the parts
  const formattedDate = new Date(parts[0], parts[1] - 1, parts[2]);

  // Get day, month, and year
  const day = formattedDate.getDate().toString().padStart(2, "0");
  const month = (formattedDate.getMonth() + 1).toString().padStart(2, "0");
  const year = formattedDate.getFullYear();

  // Return the formatted date
  return `${day}/${month}/${year}`;
}

function setImg(i, numberPart, textPart) {
  let task = tasks_board[0][textPart][numberPart];
  if (task.sub_tasks[i].endsWith("_finished")) {
    document.getElementById("check_" + i).src = "./assets/img/Check_button.png";
  } else {
    document.getElementById("check_" + i).src =
      "./assets/img/Check_button_unchecked.png";
  }
}

async function check(i, nb, text) {
  let task = tasks_board[0][text][nb];
  if (!task.sub_tasks[i].endsWith("_finished")) {
    task.sub_tasks[i] = task.sub_tasks[i] + "_finished";
    all_user["tasks"] = tasks_board;
    await setItem("users", all_user);
    document.getElementById("check_" + i).src = "./assets/img/Check_button.png";
  } else {
    task.sub_tasks[i] = task.sub_tasks[i].replace("_finished", "");
    all_user["tasks"] = tasks_board;
    await setItem("users", all_user);
    document.getElementById("check_" + i).src =
      "./assets/img/Check_button_unchecked.png";
  }
}

function not_hover_over_check(i, nb, text) {
  let task = tasks_board[0][text][nb];
  if (task.sub_tasks[i].endsWith("_finished")) {
    document.getElementById("check_" + i).src = "./assets/img/Check_button.png";
  } else {
    document.getElementById("check_" + i).src =
      "./assets/img/Check_button_unchecked.png";
  }
}

function hover_over_check(i, nb, text) {
  let task = tasks_board[0][text][nb];
  if (!task.sub_tasks[i].endsWith("_finished")) {
    document.getElementById("check_" + i).src = "./assets/img/Check_button.png";
  } else {
    document.getElementById("check_" + i).src =
      "./assets/img/Check_button_unchecked.png";
  }
}
