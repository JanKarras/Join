async function board_init() {
  contacts();
}

function openAddTask() {
  let addTask = document.getElementById("addTaskPopUpWindowContent");
  let overlay = document.querySelector(".overlay");
  addTask.classList.remove("d-none");
  overlay.classList.remove("d-none");
  addTask.style.left = "50%"
}
function closeAddTask() {
  let addTask = document.getElementById("addTaskPopUpWindowContent");
  let overlay = document.querySelector(".overlay");
  addTask.classList.add("d-none");
  overlay.classList.add("d-none");
}
