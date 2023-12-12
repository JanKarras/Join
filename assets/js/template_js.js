let btns = ["summary", "add_task", "board", "contacts" , "privacy_policy" , "legal_notice"]; //array with all  the ids of the buttons
let position; //the position on wich side we are on our website
const urlParams = new URLSearchParams(window.location.search);
const Email = urlParams.get('userEmail'); //the logged in Email to get the right infomrations (conatacts, taks, ...)
let all_user = []; // Global array with all users

/**
 * This function is used to call all the functions that we need to initialize our 'template.html'. It sets our position to our starting side, which is 'summary'.
 * 
 */
async function template_init(){
  await get_all_user();
  await includeHTML();
  await includeHTML_with_name('summary');
  summary_init();
  position = "summary";
}

/**
 * This function populates the 'all_user' array with information retrieved from the backend.
 */
async function get_all_user(){
    let res = await getItem('users');
    let users = res['data']['value'];
    users = JSON.parse(users);
    all_user = users;
    console.log(all_user);
}

/**
 * Navigates through the website by handling button clicks.
 * Adds the 'btn_clicked' class to the clicked button, removing it from the previously selected button.
 * Uses the 'btns' array containing the IDs of all buttons.
 * Reloads the new webpage using 'includeHTML_with_name'.
 * Calls 'runAdditionalFunction' with the 'name' parameter.
 * Updates the 'position' variable to the 'name' parameter, except when 'name' is 'help'.
 * 
 * @param {*} name - The ID of the clicked button.
 */
async function menue_clicked(name) {
  for (let i = 0; i < btns.length; i++) {
    const element = btns[i];
    document.getElementById(element).classList.remove("btn_clicked");
  }
  document.getElementById(name).classList.add("btn_clicked");
  await includeHTML_with_name(name);
  runAdditionalFunction(name);
  if (name != "help")
    position = name;
}

/**
 * Executes an additional function based on the provided 'name'.
 * It constructs the initialization function name by appending '_init' to the 'name'.
 * Checks if the constructed function exists in the global scope (window) and executes it if it does.
 * Outputs an error to the console if the function is not found.
 * 
 * @param {*} name - The identifier used to construct the initialization function name.
 */
function runAdditionalFunction(name) {
  const initFunctionName = name + "_init";
  if (typeof window[initFunctionName] === 'function') {
    window[initFunctionName]();
  } else {
    console.error(`Function ${initFunctionName} not found.`);
  }
}

/**
 * Loads and includes the HTML content from a specified file into a container element with the ID 'content'.
 * Uses the 'fileName' parameter to fetch the corresponding HTML file.
 * Displays an error if the container element with ID 'content' is not found.
 * 
 * @param {string} fileName - The name of the HTML file (without the file extension) to be included.
 */
async function includeHTML_with_name(fileName) {
  try {
    let container = document.querySelector("#content"); // Verwende eine spezifische ID für das Container-Element
    if (!container) {
      console.error("Container with ID 'content' not found.");
      return;
    }

    let resp = await fetch(fileName + ".html");
    if (resp.ok) {
      container.innerHTML = await resp.text();
      container.removeAttribute("w3-include-html"); // Entferne das Attribut
    } else {
      console.error("Page not found: " + fileName + ".html");
    }
  } catch (error) {
    console.error("Error fetching or including the HTML file:", error);
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
