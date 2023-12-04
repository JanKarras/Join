let btns = ["summary", "add_task", "board", "contacts"];

function smoothPageTransition(nextPage) {
  
}

async function menue_clicked(name) {
  for (let i = 0; i < btns.length; i++) {
    const element = btns[i];
    document.getElementById(element).classList.remove("btn_clicked");
  }
  document.getElementById(name).classList.add("btn_clicked");
}
