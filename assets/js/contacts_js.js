let users = [
  {
    id: 1,
    name: "Anton Mayer",
    email: "anton@outlook.com",
    telefon: "01551032454",
  },
  {
    id: 2,
    name: "Anita Gant",
    email: "anita@aol.com.com",
    telefon: "01551032454",
  },
  {
    id: 3,
    name: "Elena James",
    email: "elenajames@gmail.com",
    telefon: "016031032215",
  },
  {
    id: 4,
    name: "Zoe Graber",
    email: "zoegraber@web.de",
    telefon: "015211032454",
  },
  {
    id: 5,
    name: "Shawn Peter",
    email: "sp@live.com",
    telefon: "01601032491",
  },
  {
    id: 6,
    name: "Seun Dede",
    email: "seun@outlook.com",
    telefon: "01781032872",
  },
  {
    id: 7,
    name: "Christina Justus",
    email: "cjustus@gmail.com",
    telefon: "01781031072",
  },
  {
    id: 8,
    name: "Philip Chanel",
    email: "philipchanel@yahoo.com",
    telefon: "01781032872",
  },
];

const userName = document.getElementById("name_email");
const userInfo = document.getElementById("contact_details");
const clickedContact = document.querySelector(".contact_name");

let currentAlphabet = "";

users.sort((a, b) => a.name.localeCompare(b.name));

async function includeHTML() {
  let includeElements = document.querySelectorAll('[w3-include-html]'); //Alle Elemente mit w3-include-html in einem Array Speichern
  for (let i = 0; i < includeElements.length; i++) { //Durch das ganze array durchgehen
      const element = includeElements[i];
      file = element.getAttribute("w3-include-html"); // "includes/header.html" Speichert den dateinpfad
      let resp = await fetch(file); //Anfrage an die file zum laden. Anwort in resp speichern
      if (resp.ok) {
          element.innerHTML = await resp.text(); // Der ganze string aus header.html ist dadrinne gespeichert.
      } else {
          element.innerHTML = 'Page not found';
      }
  }
}

async function contacts_init(){
    await includeHTML();
    menue_clicked('contacts');
    displayUsers();
}

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
}

function deleteUser(userId, i) {
  users = users.filter((user) => user.id !== userId);
  displayUsers();
  displayUserDetails(i);
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
  const user = users[i];
  return `
  <div class="contacts_heading">
  <h2>Contacts</h2>
  <div class="partition"></div>
  <p>Better with a team</p>
  </div>
  <div class="info">
  <div class="contacts_edit" id="username_info">
    <p>${nameInitials}</p>
    <div class="contactname">
      <h3>${user.name}</h3>
      <div class="contact_icon">
        <span  class="delete_edit"><i class="fa-solid fa-pencil"></i><span>Edit</span></span>
        <span class="delete_edit"  onclick="deleteUser(${user.id})"
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
