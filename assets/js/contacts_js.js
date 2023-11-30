let users = [
  {
    name: "Anton Mayer",
    email: "anton@gmail.com",
    telefon: "01551032454",
  },
  {
    name: "Anita James",
    email: "anton@gmail.com",
    telefon: "01551032454",
  },
  {
    name: "Elena James",
    email: "helena@gmail.com",
    telefon: "01331032454",
  },
  {
    name: "Zoe Graber",
    email: "anton@gmail.com",
    telefon: "01551032454",
  },
  {
    name: "Shawn Peter",
    email: "anton@gmail.com",
    telefon: "01551032454",
  },
  {
    name: "Seun Dede",
    email: "anton@gmail.com",
    telefon: "01551032454",
  },
];

const userName = document.getElementById("name_email");
const userInfo = document.getElementById("contact_details");

//window.onload = displayUsers;

function contacts_init() {
  displayUsers();
}

users.sort((a, b) => a.name.localeCompare(b.name));

function displayUsers() {
  let currentAlphabet = "";
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

  const names = user.name.split(" ");
  let nameInitials = names[0].charAt(0).toUpperCase();
  nameInitials += names[names.length - 1].charAt(0).toUpperCase();

  userInfo.innerHTML += `
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
          <span><i class="fa-solid fa-pencil"></i><span>Edit</span></span>
          <span
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

function userHTML(i, firstAlphabet, nameInitials) {
  const user = users[i];
  return `
    <div class="alphabet" id="alphabet">
    <h3>${firstAlphabet}</h3>
  </div>
  <div class="contacts_initials">
    <div class="contact_name anton" onclick="displayUserDetails(${i})">
      <span>${nameInitials}</span>
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
  return ` 
    <div class="contact_name anton" onclick="displayUserDetails(${i})">
    <span>${nameInitials}</span>
    <div>
      <h4>${user.name}</h4>
      <h5>${user.email}</h5>
    </div>
  </div>
    `;
}
