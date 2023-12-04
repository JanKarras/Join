let users = [
  {
    name: "Anton Mayer",
    email: "anton@outlook.com",
    telefon: +491514567813,
  },
  {
    name: "Anita Gant",
    email: "anita@aol.com",
    telefon: +491510527872,
  },
  {
    name: "Elena James",
    email: "elenajames@gmail.com",
    telefon: +497714567894,
  },
  {
    name: "Zoe Graber",
    email: "zoegraber@web.de",
    telefon: +4915145678512,
  },
  {
    name: "Shawn Peter",
    email: "sp@live.com",
    telefon: +491602135121,
  },
  {
    name: "Seun Dede",
    email: "seun@outlook.com",
    telefon: +491554567890,
  },
  {
    name: "Christina Justus",
    email: "cjustus@gmail.com",
    telefon: +491781161324,
  },
  {
    name: "Philip Chanel",
    email: "philipchanel@yahoo.com",
    telefon: +491514567890,
  },
];

window.onload = contacts_init();

const userName = document.getElementById("name_email");
const userInfo = document.getElementById("contact_details");
const contactInitials = document.getElementById("contactInitials");

let initials;
let currentUserIndex;
let currentAlphabet = "";


async function contacts_init() {
  await includeHTML();
  menue_clicked("contacts");
  displayUsers();
}

function displayUsers() {
  users.sort((a, b) => a.name.localeCompare(b.name));
  userName.innerHTML = "";
  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    const firstAlphabet = user.name.charAt(0).toUpperCase();
    const names = user.name.split(" ");
    let nameInitials = names[0].charAt(0).toUpperCase();
    nameInitials += names[names.length - 1].charAt(0).toUpperCase();
    if (firstAlphabet !== currentAlphabet) {
      userName.innerHTML += userHTML(i, firstAlphabet, nameInitials);
      currentAlphabet = firstAlphabet;
    } else {
      userName.innerHTML += sortedUserHTML(i, nameInitials);
    }
  }
}

function displayUserDetails(i) {
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

  document.querySelector(".info").classList.add("show-info");
}

function addBackgroundColor(i) {
  const contactNames = document.querySelectorAll(".contact_name");
  contactNames.forEach((contact) => {
    contact.classList.remove("selected-contact");
  });
  const selectedContact = document.querySelector(
    `.contact_name[data-index="${i}"]`
  );
  if (selectedContact) {
    selectedContact.classList.add("selected-contact");
  }
}

function deleteUserByIndex(index) {
  currentUserIndex = index;
  if (currentUserIndex >= 0 && currentUserIndex < users.length) {
    users.splice(currentUserIndex, 1);
    displayUsers();
    displayUserDetails();
    closeEditContactPopup();
  }
}

function openAddContactPopup() {
  document.getElementById("addContactPopup").classList.add("show");
  document.getElementById("overlay").style.display = "block";
}

function closeAddContactPopup() {
  document.getElementById("addContactPopup").classList.remove("show");
  document.getElementById("overlay").style.display = "none";
}

function addContactPopup() {
  let newName = document.getElementById("addName").value;
  let newEmail = document.getElementById("addEmail").value;
  let newTelefon = +document.getElementById("addPhone").value;
  if (!newName || !newEmail || !newTelefon) {
    return;
  }
  const newUser = { name: newName, email: newEmail, telefon: newTelefon };
  users.push(newUser);
  users.sort((a, b) => a.name.localeCompare(b.name));
  const newUserIndex = users.findIndex((user) => user === newUser);
  currentUserIndex = newUserIndex;
  clearForm();
  closeAddContactPopup();
  displayUsers();
  displayUserDetails(currentUserIndex);
}

function clearForm() {
  document.getElementById("addName").value = "";
  document.getElementById("addEmail").value = "";
  document.getElementById("addPhone").value = "";
}

function openEditContactPopup(currentUserIndex) {
  const userColor = getUserColor(currentUserIndex);
  const user = users[currentUserIndex];
  document.getElementById("editName").value = user.name;
  document.getElementById("editEmail").value = user.email;
  document.getElementById("editPhone").value = user.telefon;
  contactInitials.innerText = initials;
  contactInitials.style.backgroundColor = userColor;
  document.getElementById("editContactPopup").classList.add("show");
  document.getElementById("overlay").style.display = "block";
}

function saveChanges() {
  let user = users[currentUserIndex];
  let editedName = document.getElementById("editName").value;
  let editedEmail = document.getElementById("editEmail").value;
  let editedPhone = document.getElementById("editPhone").value;
  user.name = editedName;
  user.email = editedEmail;
  user.telefon = editedPhone;
  closeEditContactPopup();
  displayUserDetails(currentUserIndex);
  displayUsers();
  addBackgroundColor(currentUserIndex);
}

function closeEditContactPopup() {
  document.getElementById("editContactPopup").classList.remove("show");
  document.getElementById("overlay").style.display = "none";
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

function getUserColor(index) {
  if (!userColorMap[index]) {
    // If the user doesn't have a color assigned, assign one
    const colorIndex = index % colors.length;
    userColorMap[index] = colors[colorIndex];
  }
  return userColorMap[index];
}

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
