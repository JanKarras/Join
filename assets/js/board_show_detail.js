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
  renderDetails(numberPart, textPart);
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
 * Rendert die Details eines Tasks basierend auf dem task numberPart und textPart.
 *
 * @param {number} numberPart - Der numerische Teil der Aufgaben-ID.
 * @param {string} textPart - Der textliche Teil der Aufgaben-ID (z.B. "todo", "in_progress").
 */
function renderDetails(numberPart, textPart) {
  let task = tasksBoard[0][textPart][numberPart];
  renderCatTitleDesPrio(task);
  if (task.ass_to.length != 0) {
    let initials = getInitials(task);
    renderInitialsDetail(initials, task);
  }
  else
    document.getElementById('ass_to_con').classList.add('d-none');
  (task.sub_tasks.length)
  if (task.sub_tasks.length != 0) {
    renderSubTasksDetail(task, numberPart, textPart);
  }
  else {
    document.getElementById('sub').classList.add('d-none');
    document.getElementById('sub_head').classList.add('d-none');
  }
  addEventListenerDetail(numberPart, textPart);
}

/**
 * Rendert die Kategorie, den Titel, die Beschreibung und die Priorität eines Tasks.
 *
 * @param {object} task - Der Task-Objekt.
 */
function renderCatTitleDesPrio(task) {
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
}

/**
 * Ruft die Initialen der zugewiesenen Benutzer ab.
 *
 * @param {object} task - Der Task-Objekt.
 * @returns {Array} - Ein Array mit den Initialen der zugewiesenen Benutzer.
 */
function getInitials(task) {
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
  return (initials);
}

/**
 * Rendert die Initialen der zugewiesenen Benutzer im Detailbereich.
 *
 * @param {Array} initials - Ein Array mit den Initialen der zugewiesenen Benutzer.
 * @param {object} task - Der Task-Objekt.
 */
function renderInitialsDetail(initials, task) {
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

/**
 * Rendert die Details der Teilaufgaben eines Tasks.
 *
 * @param {object} task - Der Task-Objekt.
 * @param {number} numberPart - Der numerische Teil der Aufgaben-ID.
 * @param {string} textPart - Der textliche Teil der Aufgaben-ID (z.B. "todo", "in_progress").
 */
function renderSubTasksDetail(task, numberPart, textPart) {
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

/**
 * Fügt Event-Listener für die Detailansicht hinzu.
 *
 * @param {number} numberPart - Der numerische Teil der Aufgaben-ID.
 * @param {string} textPart - Der textliche Teil der Aufgaben-ID (z.B. "todo", "in_progress").
 */
function addEventListenerDetail(numberPart, textPart) {
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
  let temp_task = JSON.parse(JSON.stringify(tasksBoard[0][text][nb]));
  let task = tasksBoard[0][text][nb];
  if (!task.sub_tasks[i].endsWith("_finished")) {
    task.sub_tasks[i] = task.sub_tasks[i] + "_finished";
    allUser['tasks'] = tasksBoard;
    await sendSubTaskCheckedToAllUsers(i, nb, text, temp_task, task);
    //await setItem('users', allUser);
    document.getElementById("check_" + i).src = "./assets/img/Check_button.png"
  }
  else {
    task.sub_tasks[i] = task.sub_tasks[i].replace("_finished", "");
    allUser['tasks'] = tasksBoard;
    await sendSubTaskCheckedToAllUsers(i, nb, text, temp_task, task);
    //await setItem('users', allUser);
    document.getElementById("check_" + i).src = "./assets/img/Check_button_unchecked.png"
  }
}

/**
 * Sends changes related to the status of a subtask to all users.
 * @param {number} i - The index of the subtask.
 * @param {number} numberPart - The numeric part.
 * @param {string} textPart - The text part.
 * @param {object} temp_task - The original task object before changes.
 * @param {object} task - The task object with changes.
 * @returns {void}
 * @async
 */
async function sendSubTaskCheckedToAllUsers(i, numberPart, textPart, temp_task, task){
  let emails = tasksBoard[0][textPart][numberPart].ass_to;
  for (let i = 0; i < allUser.length; i++) {
    const user = allUser[i];
    for (let j = 0; j < emails.length; j++) {
      const email = emails[j];
      if (user.email == email){
        if (email != Email){
          for (let k = 0; k < user.tasks[0][textPart].length; k++) {
            const element = user.tasks[0][textPart][k];
            if (JSON.stringify(element) === JSON.stringify(temp_task)){
              if (!user.tasks[0][textPart][k].sub_tasks[i - 1].endsWith("_finished")){
                user.tasks[0][textPart][k].sub_tasks[i - 1] = user.tasks[0][textPart][k].sub_tasks[i - 1] + "_finished"
              }
              else {
                user.tasks[0][textPart][k].sub_tasks[i - 1] = user.tasks[0][textPart][k].sub_tasks[i - 1].replace("_finished", "");
              }
            }
          }
        }
      }
    }
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
  if (document.getElementById('search_bar_input').value == ""){
    displayTasks()
  } else {
    await loadUserstasksBoard();
    let temp = searchTasks();
    displaySearchResults(temp[0]);
  }
}

function displaySearchResults(temp){
  const todo = document.getElementById("todo");
  const inProgress = document.getElementById("in_progress");
  const awaitFeedback = document.getElementById("feedback");
  const done = document.getElementById("done");
  clearTaskContainers(todo, inProgress, awaitFeedback, done);
  if (!temp)
    return ;
  for (const status in temp[0]) {
    if (temp[0].hasOwnProperty(status)) {
      const tasksInStatus = temp[0][status];
      displayTasksInStatus(status, tasksInStatus);
    }
  }
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
  let emails = tasksBoard[0][textPart][numberPart].ass_to;
  for (let i = 0; i < allUser.length; i++) {
    const user = allUser[i];
    for (let j = 0; j < emails.length; j++) {
      const email = emails[j];
      if (user.email == email) {
        if (email != Email){
          for (let k = 0; k < user.tasks[0][textPart].length; k++) {
            const element = user.tasks[0][textPart][k];
            if (JSON.stringify(element) === JSON.stringify(tasksBoard[0][textPart][numberPart]))
              user.tasks[0][textPart].splice(k, 1);
          }
        }
      }
    }
  }
  for (let i = 0; i < allUser.length; i++) {
    const user = allUser[i];
    for (let j = 0; j < emails.length; j++) {
      const email = emails[j];
      if (user.email == email && email == Email)
        user.tasks[0][textPart].splice(numberPart, 1);
    }
  }
  await setItem('users', allUser);
  closePopup();
}
