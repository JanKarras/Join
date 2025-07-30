let btns = ["summary", "add_task", "board", "contacts", "privacy_policy", "legal_notice"]; //array with all  the ids of the buttons
let position; //the position on wich side we are on our website
const urlParams = new URLSearchParams(window.location.search);
const Email = urlParams.get('userEmail'); //the logged in Email to get the right infomrations (conatacts, taks, ...)
let allUser = []; // Global array with all users

/**
 * This function is used to call all the functions that we need to initialize our 'template.html'. It sets our position to our starting side, which is 'summary'.
 * 
 */
async function templateInit() {
  await includeHTML();
  if (Email == "privacy_policy" || Email == "legal_notice") {
    if (Email == "privacy_policy") {
      await includeHTMLWithName('privacy_policy');
    }
    if (Email == "legal_notice") {
      await includeHTMLWithName('legal_notice');
    }
    return;
  }
  await includeHTMLWithName('summary');
  summaryInit();
  position = "summary";
}

/**
 * This function populates the 'allUser' array with information retrieved from the backend.
 */
async function getAllUser() {
  let res = await getItem('users');
  let user_array = res['data']['value'];
  user_array = JSON.parse(user_array);
  allUser = user_array;
}

/**
 * Navigates through the website by handling button clicks.
 * Adds the 'btn_clicked' class to the clicked button, removing it from the previously selected button.
 * Uses the 'btns' array containing the IDs of all buttons.
 * Reloads the new webpage using 'includeHTMLWithName'.
 * Calls 'runAdditionalFunction' with the 'name' parameter.
 * Updates the 'position' variable to the 'name' parameter, except when 'name' is 'help'.
 * 
 * @param {*} name - The ID of the clicked button.
 */
async function menueClicked(name) {
  for (let i = 0; i < btns.length; i++) {
    const element = btns[i];
    document.getElementById(element).classList.remove("btn_clicked");
  }
  document.getElementById(name).classList.add("btn_clicked");
  if (Email != "privacy_policy" && Email != "legal_notice") {
    await includeHTMLWithName(name);
    runAdditionalFunction(name);
    if (name != "help")
      position = name;
    if (name == 'board')
      document.getElementById('header_content_container').style.height = '100%';
    else
      document.getElementById('header_content_container').style.height = '';
  } else {
    if (name == "privacy_policy" || name == "legal_notice") {
      await includeHTMLWithName(name);
      runAdditionalFunction(name);
      if (name != "help")
        position = name;
      if (name == 'board')
        document.getElementById('header_content_container').style.height = '100%';
      else
        document.getElementById('header_content_container').style.height = '';
    } else {
      window.location.href = `index.html`;
    }
  }
}

/**
 * Executes an additional function based on the provided 'name'.
 * It constructs the initialization function name by appending '_init' to the 'name'.
 * Checks if the constructed function exists in the global scope (window) and executes it if it does.
 * 
 * @param {*} name - The identifier used to construct the initialization function name.
 */
function runAdditionalFunction(name) {
  const initFunctionName = name + "Init";
  if (typeof window[initFunctionName] === 'function') {
    window[initFunctionName]();
  } else {
  }
}

/**
 * Loads and includes the HTML content from a specified file into a container element with the ID 'content'.
 * Uses the 'fileName' parameter to fetch the corresponding HTML file.
 * Displays an error if the container element with ID 'content' is not found.
 * 
 * @param {string} fileName - The name of the HTML file (without the file extension) to be included.
 */
async function includeHTMLWithName(fileName) {
  try {
    let container = document.querySelector("#content"); // Verwende eine spezifische ID für das Container-Element
    if (!container) {
      return;
    }
    let resp = await fetch(fileName + ".html");
    if (resp.ok) {
      container.innerHTML = await resp.text();
      container.removeAttribute("w3-include-html"); // Entferne das Attribut
    } else {
    }
  } catch (error) {
  }
}

/**
 * Loads and includes the HTML content for all elements with the 'w3-include-html' attribute.
 * Fetches the HTML file specified in the 'w3-include-html' attribute for each element.
 * Displays an error message if the file is not found.
 */
async function includeHTML() {
  let includeElements = document.querySelectorAll('[w3-include-html]');
  for (let i = 0; i < includeElements.length; i++) {
    const element = includeElements[i];
    file = element.getAttribute("w3-include-html");
    let resp = await fetch(file);
    if (resp.ok) {
      element.innerHTML = await resp.text();
    } else {
      element.innerHTML = 'Page not found';
    }
  }
}
