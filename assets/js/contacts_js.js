let users = [];

/**
 * Initializes the 'contacts' page by loading users' contacts and displaying them.
 */
async function contacts_init() {
  await load_users_contacts();
  displayUsers();
}

/**
 * Loads the contacts of the logged-in user from the 'all_user' array.
 * Populates the 'users' array with the loaded contacts.
 */
async function load_users_contacts() {
  users.length = 0;
  for (let i = 0; i < all_user.length; i++) {
    const user = all_user[i];
    if (user["email"] == Email) {
      for (let j = 0; j < user["contacts"].length; j++) {
        const conatact = user["contacts"][j];
        users.push(conatact);
      }
      break;
    }
  }
}

/**
 * Sets the contacts of the logged-in user in the 'all_user' array.
 * Saves the updated 'all_user' array using the 'setItem' function.
 */
async function set_users_contacts() {
  for (let i = 0; i < all_user.length; i++) {
    const user = all_user[i];
    if (user["email"] == Email) {
      user["contacts"].length = 0;
      for (let j = 0; j < users.length; j++) {
        const contacts = users[j];
        user["contacts"].push(contacts);
      }
      setItem("users", all_user);
      break;
    }
  }
  await setItem("users", all_user);
  await get_all_user();
}

let initials;
let nameInitials;
let currentUserIndex;
let currentAlphabet = "";

/**
 * Displays the list of users on the 'contacts' page and sorts them alphabetically.
 * Initializes the user interface with user details.
 */
function displayUsers() {
  const userName = document.getElementById("name_email");
  users.sort((a, b) => a.name.localeCompare(b.name));
  userName.innerHTML = "";
  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    const firstAlphabet = user.name.charAt(0).toUpperCase();
    const names = user.name.split(" ");
    nameInitials = names[0].charAt(0).toUpperCase();
    nameInitials += names[names.length - 1].charAt(0).toUpperCase();
    if (firstAlphabet !== currentAlphabet) {
      userName.innerHTML += userHTML(i, firstAlphabet, nameInitials);
      currentAlphabet = firstAlphabet;
    } else {
      userName.innerHTML += sortedUserHTML(i, nameInitials);
    }
  }
}

/**
 * Displays details of a selected user on the 'contacts' page.
 * Highlights the selected user and shows their information.
 *
 * @param {number} i - Index of the selected user.
 */
function displayUserDetails(i) {
  const userInfo = document.getElementById("contact_details");
  document.querySelector(".add_contact_mobile").classList.add("d-none-m");
  document.querySelector(".edit_contact_mobile").classList.add("d-block-m");
  addBackgroundColor(i);
  userInfo.innerHTML = "";
  const user = users[i];
  if (!user) {
    return;
  }
  const names = user.name.split(" ");
  let nameInitials = names[0].charAt(0).toUpperCase();
  nameInitials += names[names.length - 1].charAt(0).toUpperCase();
  userInfo.innerHTML += userDetailHTML(i, nameInitials);
  checkWidth();
  document.querySelector(".info").classList.add("show-info");
}

function checkWidth() {
  const contactDetail = document.querySelector(".contact_detail");
  const contact = document.querySelector(".contact_sidebar");
  contact.classList.add("d-none");
  contactDetail.classList.add("d-block");
}

function displayContacts() {
  const contactDetail = document.querySelector(".contact_detail");
  const contact = document.querySelector(".contact_sidebar");
  document.querySelector(".add_contact_mobile").classList.remove("d-none-m");
  document.querySelector(".edit_contact_mobile").classList.remove("d-block-m");
  contact.classList.remove("d-none");
  contactDetail.classList.remove("d-block");
  removeBackgroundColor();
}

function removeBackgroundColor() {
  const contactNames = document.querySelectorAll(".contact_name");
  contactNames.forEach((contact) => {
    contact.classList.remove("selected-contact");
  });
}

/**
 * Adds background color to the selected user in the list.
 *
 * @param {number} i - Index of the selected user.
 */
function addBackgroundColor(i) {
  removeBackgroundColor();
  const selectedContact = document.querySelector(
    `.contact_name[data-index="${i}"]`
  );
  if (selectedContact) {
    selectedContact.classList.add("selected-contact");
  }
}

/**
 * Deletes a user based on their index.
 *
 * @param {number} index - Index of the user to be deleted.
 */
async function deleteUserByIndex(index) {
  currentUserIndex = index;
  console.log(users);
  if (currentUserIndex >= 0 && currentUserIndex < users.length) {
    users.splice(currentUserIndex, 1);
    await set_users_contacts();
    await load_users_contacts();
    displayUsers();
    displayUserDetails();
    closeEditContactPopup();
  }
}

/**
 * Opens the add contact popup by adding the 'show' class and displaying the overlay.
 */
function openAddContactPopup() {
  document.getElementById("addContactPopup").classList.add("show");
  document.getElementById("overlay").style.display = "block";
}

/**
 * Closes the add contact popup by removing the 'show' class and hiding the overlay.
 */
function closeAddContactPopup() {
  document.getElementById("addContactPopup").classList.remove("show");
  document.getElementById("overlay").style.display = "none";
}

function openEditandDelete() {
  document.querySelector(".contact_icon").style.display = "flex";
  document.querySelector(".contact_icon").style.right = "1rem";
}

function closeEditandDelete() {
  document.querySelector(".contact_icon").style.display = "none";
  document.querySelector(".contact_icon").style.right = "77px";
}

/**
 * Adds a new contact based on the input values, sorts the users, and updates the display.
 */
async function addContactPopup() {
  let newName = document.getElementById("addName").value;
  let newEmail = document.getElementById("addEmail").value;
  let newTelefon = +document.getElementById("addPhone").value;
  if (!newName || !newEmail || !newTelefon) {
    return;
  }
  for (let i = 0; i < users.length; i++) {
    const element = users[i];
    if (element["email"] == newEmail) return;
  }
  const newUser = { name: newName, email: newEmail, telefon: newTelefon };
  users.push(newUser);
  await set_users_contacts();
  await load_users_contacts();
  users.sort((a, b) => a.name.localeCompare(b.name));
  for (let i = 0; i < users.length; i++) {
    const element = users[i];
    if (element["email"] == newEmail) {
      currentUserIndex = i;
      break;
    }
  }
  clearForm();
  closeAddContactPopup();
  displayUsers();
  displayUserDetails(currentUserIndex);
}

/**
 * Clears the input form by setting the values to an empty string.
 */
function clearForm() {
  document.getElementById("addName").value = "";
  document.getElementById("addEmail").value = "";
  document.getElementById("addPhone").value = "";
}

/**
 * Opens the edit contact popup and sets initial values based on the selected user.
 *
 * @param {number} currentUserIndex - Index of the selected user.
 */
function openEditContactPopup(currentUserIndex) {
  const userColor = getUserColor(currentUserIndex);
  const user = users[currentUserIndex];
  document.getElementById("editName").value = user.name;
  document.getElementById("editEmail").value = user.email;
  document.getElementById("editPhone").value = user.telefon;
  document.getElementById("contactInitials").innerText = initials;
  document.getElementById("contactInitials").style.backgroundColor = userColor;
  document.getElementById("editContactPopup").classList.add("show");
  document.getElementById("overlay").style.display = "block";
  closeEditandDelete();
}

/**
 * Saves the changes made in the edit contact popup, updates user details, and closes the popup.
 */
async function saveChanges() {
  let user = users[currentUserIndex];
  let editedName = document.getElementById("editName").value;
  let editedEmail = document.getElementById("editEmail").value;
  let editedPhone = document.getElementById("editPhone").value;
  user.name = editedName;
  user.email = editedEmail;
  user.telefon = editedPhone;
  await set_users_contacts();
  await load_users_contacts();
  closeEditContactPopup();
  displayUserDetails(currentUserIndex);
  displayUsers();
  addBackgroundColor(currentUserIndex);
}

/**
 * Closes the edit contact popup by removing the 'show' class and hiding the overlay.
 */
function closeEditContactPopup() {
  document.getElementById("editContactPopup").classList.remove("show");
  document.getElementById("overlay").style.display = "none";

  displayUserDetails(currentUserIndex);
}

const colors = [
  "#9f36e6",
  "purple",
  "#e614a0",
  "#2ec5a4",
  "orange",
  "#dd5d13",
  "#1e796a",
];

const userColorMap = {};

/**
 * Gets the color for a user based on their index.
 *
 * @param {number} index - Index of the user.
 * @returns {string} - Color code.
 */
function getUserColor(index) {
  if (!userColorMap[index]) {
    // If the user doesn't have a color assigned, assign one
    const colorIndex = index % colors.length;
    userColorMap[index] = colors[colorIndex];
  }
  return userColorMap[index];
}

/**
 * Generates HTML for a user in the contacts list.
 *
 * @param {number} i - Index of the user.
 * @param {string} firstAlphabet - First alphabet of the user's name.
 * @param {string} nameInitials - Initials of the user's name.
 * @returns {string} - HTML string.
 */
function userHTML(i, firstAlphabet, nameInitials) {
  const user = users[i];
  const userColor = getUserColor(i);
  return `
      <div class="alphabet" id="alphabet">
        <h3>${firstAlphabet}</h3>
      </div>
      <div class="contacts_initials">
        <div href="#" class="contact_name anton" data-index="${i}" onclick="displayUserDetails(${i})">
          <span style="background-color: ${userColor}">${nameInitials}</span>
          <div>
            <h4>${user.name}</h4>
            <h5>${user.email}</h5>
          </div>
        </div>
      </div>
    `;
}

/**
 * Generates HTML for a sorted user in the contacts list.
 *
 * @param {number} i - Index of the user.
 * @param {string} nameInitials - Initials of the user's name.
 * @returns {string} - HTML string.
 */
function sortedUserHTML(i, nameInitials) {
  const user = users[i];
  const userColor = getUserColor(i);
  return ` 
      <div class="contact_name anton" data-index="${i}" onclick="displayUserDetails(${i})">
        <span style="background-color: ${userColor}">${nameInitials}</span>
        <div>
          <h4>${user.name}</h4>
          <h5>${user.email}</h5>
        </div>
      </div>
    `;
}

/**
 * Generates HTML for the details of a user on the 'contacts' page.
 *
 * @param {number} i - Index of the user.
 * @param {string} nameInitials - Initials of the user's name.
 * @returns {string} - HTML string.
 */
function userDetailHTML(i, nameInitials) {
  const userColor = getUserColor(i);
  currentUserIndex = i;
  initials = nameInitials;
  let user = users[currentUserIndex];
  return `
    <div class="info">
    <div class="contacts_edit" id="username_info">
      <p style="background-color: ${userColor}">${initials}</p>
      <div class="contactname">
        <h3>${user.name}</h3>
        <div class="contact_icon">
          <span onclick="openEditContactPopup(${i})"  class="delete_edit"><i class="fa-solid fa-pencil"></i><span>Edit</span></span>
          <span class="delete_edit"  onclick="deleteUserByIndex(${i})"
            ><i class="fa-regular fa-trash-can"></i
            ><span>Delete</span></span
          >
        </div>
      </div>
    </div>
    <div class="contact_information">
      <h4>Contact Information</h4>
      <h5>Email</h5>
      <h5 class="email">${user.email}</h5>
      <h5>Phone</h5>
      <h5>${user.telefon}</h5>
    </div>
    </div>
    `;
}
