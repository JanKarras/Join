let btns = ["summary", "add_task", "board", "contacts" , "privacy_policy" , "legal_notice"];
let position;
const urlParams = new URLSearchParams(window.location.search);
const Email = urlParams.get('userEmail');
let user_infos = [];

async function template_init(){
  await set_user_infos();
  await includeHTML();
  await includeHTML_with_name('summary');
  summary_init();
  position = "summary";
  console.log(user_infos);
}

async function set_user_infos(){
    let res = await getItem('users');
    let users = res['data']['value'];
    users = JSON.parse(users);
    for (let i = 0; i < users.length; i++) {
      const element = users[i];
      if (element['email'] == Email)
        user_infos = element;
    }
}

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

function runAdditionalFunction(name) {
  const initFunctionName = name + "_init";
  if (typeof window[initFunctionName] === 'function') {
    window[initFunctionName]();
  } else {
    console.error(`Function ${initFunctionName} not found.`);
  }
}

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
