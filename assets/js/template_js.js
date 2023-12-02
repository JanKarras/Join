let btns = ["summary", "add_task", "board", "contacts"];

function init_include(name) {
  let functionName = name.split(".")[0] + "_init";

  // Überprüfe, ob die Funktion existiert, bevor du sie aufrufst
  if (typeof window[functionName] === "function") {
    window[functionName]();
  } else {
    console.error(`Die Funktion ${functionName} existiert nicht.`);
  }
}

async function menue_clicked(name) {
  for (let i = 0; i < btns.length; i++) {
    const element = btns[i];
    document.getElementById(element).classList.remove("btn_clicked");
  }
  document.getElementById(name).classList.add("btn_clicked");
}
