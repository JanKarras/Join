let users = [
  {
    name: "Anton Mayer",
    email: "anton@outlook.com",
    telefon: +491514567813,
  },
  {
    id: 2,
    name: "Anita Gant",
    email: "anita@aol.com",
    telefon: +491510527872,
  },
  {
    id: 3,
    name: "Elena James",
    email: "elenajames@gmail.com",
    telefon: +497714567894,
  },
  {
    id: 4,
    name: "Zoe Graber",
    email: "zoegraber@web.de",
    telefon: +4915145678512,
  },
  {
    id: 5,
    name: "Shawn Peter",
    email: "sp@live.com",
    telefon: +491602135121,
  },
  {
    id: 6,
    name: "Seun Dede",
    email: "seun@outlook.com",
    telefon: +491554567890,
  },
  {
    id: 7,
    name: "Christina Justus",
    email: "cjustus@gmail.com",
    telefon: +491781161324,
  },
  // {
  //   id: 8,
  //   name: "Philip Chanel",
  //   email: "philipchanel@yahoo.com",
  //   telefon: +491514567890,
  // },
];

window.onload = displayUsers;

const userName = document.getElementById("name_email");
const userInfo = document.getElementById("contact_details");
const clickedContact = document.querySelector(".contact_name");

let currentUserIndex;
let currentAlphabet = "";

users.sort((a, b) => a.name.localeCompare(b.name));

function displayUsers() {
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
  userInfo.innerHTML = "";
  const user = users[i];
  if (!user) {
    return;
  }
  const names = user.name.split(" ");
  let nameInitials = names[0].charAt(0).toUpperCase();
  nameInitials += names[names.length - 1].charAt(0).toUpperCase();
  userInfo.innerHTML += userDetailHTML(i, nameInitials);
  userInfo.classList.remove("translate");
  setTimeout(() => {
    userInfo.classList.add("translate");
  }, 500);
}

function deleteUser(userTelephone, i) {
  users = users.filter((user) => user.telefon !== userTelephone);
  displayUsers();
  displayUserDetails(i);
}

function openAddContactPopup() {
  document.getElementById("addContactPopup").classList.add("show_add_contact");
  document.getElementById("overlay").style.display = "block";
}

function addContactPopup() {
  let newName = document.getElementById("addName").value;
  let newEmail = document.getElementById("addEmail").value;
  let newTelefon = +document.getElementById("addPhone").value;
  if (!newName || !newEmail || !newTelefon) {
    return;
  }
  users.push({ name: newName, email: newEmail, telefon: newTelefon });
  users.sort((a, b) => a.name.localeCompare(b.name));

  clearForm();
  closeAddContactPopup();
  displayUsers();
  displayUserDetails();
}

function clearForm() {
  document.getElementById("addName").value = "";
  document.getElementById("addEmail").value = "";
  document.getElementById("addPhone").value = "";
}

function closeAddContactPopup() {
  document
    .getElementById("addContactPopup")
    .classList.remove("show_add_contact");
  document.getElementById("overlay").style.display = "none";
}

function openEditContactPopup(index) {
  currentUserIndex = index;
  const user = users[currentUserIndex];
  document.getElementById("editName").value = user.name;
  document.getElementById("editEmail").value = user.email;
  document.getElementById("editPhone").value = user.telefon;
  document.getElementById("editContactPopup").classList.add("show_add_contact");
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
  users.sort((a, b) => a.name.localeCompare(b.name));
  closeEditContactPopup();
  displayUsers();
  displayUserDetails(currentUserIndex);
}

function closeEditContactPopup() {
  document
    .getElementById("editContactPopup")
    .classList.remove("show_add_contact");
  document.getElementById("overlay").style.display = "none";
}

function userHTML(i, firstAlphabet, nameInitials) {
  const user = users[i];
  return `
    <div class="alphabet" id="alphabet">
    <h3>${firstAlphabet}</h3>
  </div>
  <div class="contacts_initials">
    <a href="#" class="contact_name anton" onclick="displayUserDetails(${i})">
      <span>${nameInitials}</span>
      <div>
        <h4>${user.name}</h4>
        <h5>${user.email}</h5>
      </div>
    </a>
  </div>
      `;
}

function sortedUserHTML(i, nameInitials) {
  const user = users[i];
  return ` 
    <a href="#" class="contact_name anton" onclick="displayUserDetails(${i})">
    <span>${nameInitials}</span>
    <div>
      <h4>${user.name}</h4>
      <h5>${user.email}</h5>
    </div>
  </a>
    `;
}

function userDetailHTML(i, nameInitials) {
  currentUserIndex = i;
  let user = users[currentUserIndex];
  return `
  <div class="info">
  <div class="contacts_edit" id="username_info">
    <p>${nameInitials}</p>
    <div class="contactname">
      <h3>${user.name}</h3>
      <div class="contact_icon">
        <span onclick="openEditContactPopup(${i})"  class="delete_edit"><i class="fa-solid fa-pencil"></i><span>Edit</span></span>
        <span class="delete_edit"  onclick="deleteUser(${user.telefon})"
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
