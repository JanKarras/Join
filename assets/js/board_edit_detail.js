let sub_tasks_edit = [];
let end_edit = false;

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
    <div class="subtasks_list margin_top_20px">
    <label>Subtasks</label>
    <div class="date_picker" onclick="enterSubtasksEdit()">
      <input
        id="enter-subtask_edit"
        type="text"
        placeholder="Add new subtask"
      />
      <span id="add-subtask_edit" class="subtask">
        <i id="openAddTask" class="fa-solid fa-plus"></i>
      </span>
      <span id="add-cancel-subtask_edit" class="add_cancel">
        <i
          onclick="clearInputFieldEdit()"
          id="delete-subtask"
          class="fa-solid fa-xmark"
        ></i>
        <i
          id="confirm-subtask"
          class="fa-solid fa-check"
          onclick="addSubtaskKarrasEdit()"
        ></i>
      </span>
    </div>
    <ul id="subtaskList_edit" class="subtask-list"></ul>
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
    sub_tasks_edit = task.sub_tasks;
    renderSubTasksKarrasEdit();
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
 * @param {Array} sub_tasks_edit - An array of subtasks to be rendered.
 */
function renderSubTasksKarrasEdit() {
  let content = document.getElementById("subtaskList_edit");
  content.innerHTML = "";
  for (let i = 0; i < sub_tasks_edit.length; i++) {
    let element = sub_tasks_edit[i];
    let displayText = element;
    if (element.endsWith("_finished")) {
      displayText = element.slice(0, -9); // Entferne die letzten 9 Zeichen, um "_finished" abzuschneiden
    }
    content.innerHTML += `
      <li class="list_element_sub_task" id="listenElementEdit${i}">
        <div class="subTaskText">${displayText}</div>
        <div class="buttons">
          <span class="edit-btn" onclick="editSubtaskKarrasEdit(${i})"><i class="fa-solid fa-pencil"></i></span>
          <span class="delete-btn" onclick="deleteSubtaskKarrasEdit(${i})"><i class="fa-regular fa-trash-can"></i></span>
        </div>
      </li>
    `;
  }
  end_edit = false;
}
  
  /**
   * Finishes the editing process, updates the task details, and closes the popup.
   * @param {number} numberPart - The index of the task within its category.
   * @param {string} textPart - The category of the task (e.g., 'todo', 'in_progress', etc.).
   */
  async function finishEdit(numberPart, textPart) {
    let temp_task = JSON.parse(JSON.stringify(tasksBoard[0][textPart][numberPart]));
    let task = tasksBoard[0][textPart][numberPart];
    task.title = document.getElementById('title_edit').value;
    task.due = document.getElementById('date_input_edit').value;
    task.ass_to = assToEmails_edit;
    task.des = document.getElementById('description_input_edit').value
    task.prio = prio_edit;
    await setChangesToAllUser(numberPart, textPart, task, temp_task);
    await setItem('users', allUser);
    closePopup();
  }

  /**
 * Toggles the visibility of the add subtask input field and the cancel button.
 * Also blurs the enter-subtask element when the cancel button is toggled.
 */
function enterSubtasksEdit(){
  const addCancel = document.getElementById("add-cancel-subtask_edit");
  const addSubtask = document.getElementById("add-subtask_edit");
  addCancel.classList.toggle("add_cancel");
  addSubtask.classList.toggle("d-none");
  if (addCancel.classList.contains("add_cancel")) {
    document.getElementById("enter-subtask").blur();
  }
}

function addSubtaskKarrasEdit(){
  sub_tasks_edit.push(document.getElementById("enter-subtask_edit").value);
  console.log(sub_tasks_edit);
  renderSubTasksKarrasEdit();
  clearInputFieldEdit();
}

/**
 * Allows editing of a subtask at the given index.
 * @param {number} index - The index of the subtask to be edited.
 */
function editSubtaskKarrasEdit(index){
  if (end_edit === true)
    return ;
  content = document.getElementById('listenElementEdit' + index);
  content.innerHTML = `
    <input type="text" class="" id="EditInputSubtaskEdit${index}">
    <span class="save_button" onclick="saveSubtaskKarrasEdit(${index})"><i class="fa-solid fa-check"></i></span>
    <span class="delte_button" onclick="deleteSubtaskKarrasEdit(${index})"><i class="fa-regular fa-trash-can"></i></span>
  `
  document.getElementById("EditInputSubtaskEdit" + index).value = sub_tasks_edit[index];
  end_edit = true;
}

/**
 * Saves the edited subtask at the given index, then re-renders the subtasks list.
 * @param {number} index - The index of the subtask to be saved.
 */
function saveSubtaskKarrasEdit(index){
  sub_tasks_edit[index] = document.getElementById("EditInputSubtaskEdit" + index).value;
  renderSubTasksKarrasEdit();
  end_edit = false;
}

/**
 * Deletes a subtask from the sub_tasks array at the given index, then re-renders the subtasks list.
 * @param {number} index - The index of the subtask to be deleted.
 */
function deleteSubtaskKarrasEdit(index){
  sub_tasks_edit.splice(index, 1);
  renderSubTasksKarrasEdit();
  end_edit = false;
}

/**
 * Clears the value of the enter-subtask_edit input field.
 */
function clearInputFieldEdit(){
  document.getElementById('enter-subtask_edit').value = "";
}

/**
 * Sets changes to tasks for all users based on the specified parameters.
 * @param {number} numberPart - The numeric part.
 * @param {string} textPart - The text part.
 * @param {object} task - The task object with changes.
 * @param {object[]} temp_task - The original task object before changes.
 */
async function setChangesToAllUser(numberPart, textPart, task, temp_task){
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
                user.tasks[0][textPart][k] = task;
              }
            }
          }
        }
      }
    }
}