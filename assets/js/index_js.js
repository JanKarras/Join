const bodyContainer = document.getElementById("container");
const container = document.getElementById("signin-container");
const joinLogo = document.getElementById("join-logo");
const logo = document.getElementById("logo");

let username = document.getElementById("name");
let email = document.getElementById("useremail");
let password = document.getElementById("userpassword");
let userEmail = document.getElementById("username");
let userPassword = document.getElementById("password");
let confirmPassword = document.getElementById("confirm-password");
let msgBox = document.getElementById("msgBox");
let checkBox = document.getElementById("checkbox");
const button = document.getElementById("signin-button");


const signInContainer = document.querySelector(".signin-container1");
const signInForm = document.querySelector(".sign-in-form");
const legality = document.querySelector(".legality");
const registerButton = document.querySelector(".register-button");


const windowWidth = window.innerWidth;

window.onload = load;

let test = [
  {
    "email": "hs",
    "name": "Jan",
    "password": "cvwKg3bq",
    "tasks": [],
    "contacts": [
      {
        "name" : "Test",
        "email": "test",
        "telefon": "test",
      }
    ],
    "subtasks" : [],
  },
  {
    "email": "testemail",
    "name": "test",
    "password": "123",
    "tasks": [],
    "contacts": [
      {
        "name" : "Test",
        "email": "test",
        "telefon": "test",
      }
    ]
  }
]

async function load() {
  if (windowWidth < 576) {
    logo.src = "./assets/img/logo-white.png";
  }
  setTimeout(function () {
    joinLogo.classList.add("moveup-logo");
    signInContainer.classList.add("d-none");
    container.classList.add("visible");
    legality.classList.add("opacity");
    bodyContainer.style.background = "#f6f7f8";
    logo.src = "./assets/img/logo.svg";
  }, 800);
  //const response = await getItem('users');
  //const usersData = response['data']['value'];
  //let usersArray = JSON.parse(usersData);
  //usersArray = usersArray.slice(0, 2);
  //setItem('users', usersArray);
  //console.log(usersArray);
  //setItem('users', test);
}

function insertSignup() {
  container.classList.add("d-none");
  signInContainer.classList.remove("d-none");
  button.disabled = true;
}

function backToLogin() {
  container.classList.remove("d-none");
  signInForm.style.animation = "none";
  signInContainer.classList.add("d-none");
}

// Login Functions

async function registerUser() {
  try {
    const response = await getItem('users');
    const usersData = response['data']['value'];
    if (usersData) {
      const usersArray = JSON.parse(usersData);
      if (check_email(usersArray, email.value) == 0) {
        console.error('Email exists use another one:', error);
      } else {
        usersArray.push({
          contacts: [],
          name: username.value,
          email: email.value,
          password: password.value,
          tasks: [],
        });
        setItem('users', usersArray);
        msgBox.style.visibility = "visible";
        setTimeout(() => {
          msgBox.style.visibility = "none";
          backToLogin();
        }, 2000);
      }
    }
  }
  catch (error) {
    console.error('Error during Sign up:', error);
  }
}

async function loginUser() {
  try {
    const response = await getItem('users');
    const usersData = response['data']['value'];

    if (usersData) {
      const usersArray = JSON.parse(usersData);
      let user = usersArray.find(
        (user) =>
          user.email == userEmail.value && user.password == userPassword.value
      );
      if (user) {
        window.location.href = `template.html?userEmail=${userEmail.value}`;
      } else {
        console.error('Invalid email or password');
      }
    } else {
      console.error('Invalid user data format');
    }
  } catch (error) {
    console.error('Error during login:', error);
  }
}

function check_email(usersArray, email) {
  console.log(usersArray);
  console.log(email);
  for (let i = 0; i < usersArray.length; i++) {
    const element = usersArray[i];
    if (element['email'] == email) {
      console.log("hs");
      return 0;
    }
  }
}

function validateUser() {
  if (checkBox.checked) {
    button.disabled = false;
    registerButton.classList.add("signin");
  } else {
    button.disabled = true;
    registerButton.classList.remove("signin");
  }
}
