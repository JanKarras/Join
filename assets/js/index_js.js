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

/**
 * Loads the page elements and adjusts styling based on the window width.
 * If the window width is less than 576 pixels, changes the logo source.
 * After a delay, adds and removes classes to animate elements and update styling.
 */
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
}

/**
 * Inserts the signup elements by adding and removing classes.
 * Hides the main container and reveals the signup container.
 * Disables the signup button.
 */
function insertSignup() {
  container.classList.add("d-none");
  signInContainer.classList.remove("d-none");
  button.disabled = true;
}

/**
 * Takes the user back to the login view by adding and removing classes.
 * Reveals the main container and hides the signup container.
 * Resets the animation on the sign-in form.
 */
function backToLogin() {
  container.classList.remove("d-none");
  signInForm.style.animation = "none";
  signInContainer.classList.add("d-none");
}

// Login Functions
/**
 * Registers a new user by retrieving the current users' data,
 * checking if the provided email is unique, and then adding the new user.
 * Displays an error if the email already exists, and redirects to the login view upon successful registration.
 */
async function registerUser() {
  try {
    const response = await getItem("users");
    const usersData = response["data"]["value"];
    if (usersData) {
      const usersArray = JSON.parse(usersData);
      if (checkEmail(usersArray, email.value) == 0) {
      } else {
        usersArray.push({
          contacts: [
            {
              name: username.value + "(You)",
              email: email.value,
            },
          ],
          name: username.value,
          email: email.value,
          password: password.value,
          tasks: [
            {
              todo: [],
              in_progress: [],
              feedback: [],
              done: [],
            },
          ],
        });
        setItem("users", usersArray);
        msgBox.style.bottom = "50%";
        setTimeout(() => {
          msgBox.style.bottom = "-100%";
          backToLogin();
        }, 2000);
      }
    }
  } catch (error) {
  }
}

/**
 * Logs in a user by retrieving the current users' data,
 * finding a matching user based on the provided email and password,
 * and redirecting to the template.html page if successful.
 * Displays an error if the email or password is invalid.
 */
async function loginUser() {
  try {
    const response = await getItem("users");
    const usersData = response["data"]["value"];
    if (usersData) {
      const usersArray = JSON.parse(usersData);
      let user = usersArray.find(
        (user) =>
          user.email == userEmail.value && user.password == userPassword.value
      );
      if (user) {
        window.location.href = `template.html?userEmail=${userEmail.value}`;
      } else {
      }
    } else {
    }
  } catch (error) {
  }
}

/**
 * Logs in as a guest user by setting the email and password fields to 'guest'
 * and then calling the loginUser function to perform the login.
 */
async function guest_login() {
  userEmail.value = "guest";
  userPassword.value = "guest";
  loginUser();
}

/**
 * Checks if an email already exists in the given users' array.
 * Returns 0 if the email exists, otherwise returns undefined.
 *
 * @param {Array} usersArray - Array of user objects.
 * @param {string} email - Email to check for uniqueness.
 * @returns {number|undefined} - 0 if the email exists, 1 otherwise.
 */
function checkEmail(usersArray, email) {
  for (let i = 0; i < usersArray.length; i++) {
    const element = usersArray[i];
    if (element["email"] == email) {
      if (element["email"] == email) {
        return 0;
      }
    }
    return 1;
  }
}

/**
 * Validates user input by enabling or disabling the registration button based on the checkbox status.
 * Adds or removes a CSS class for styling purposes.
 */
function validateUser() {
  if (checkBox.checked) {
    button.disabled = false;
    registerButton.classList.add("signin");
  } else {
    button.disabled = true;
    registerButton.classList.remove("signin");
  }
}