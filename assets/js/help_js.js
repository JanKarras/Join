async function help_init(){
    await includeHTML();
    
}

async function includeHTML() {
    let includeElements = document.querySelectorAll("[w3-include-html]"); //Alle Elemente mit w3-include-html in einem Array Speichern
    for (let i = 0; i < includeElements.length; i++) {
      //Durch das ganze array durchgehen
      const element = includeElements[i];
      file = element.getAttribute("w3-include-html"); // "includes/header.html" Speichert den dateinpfad
      let resp = await fetch(file); //Anfrage an die file zum laden. Anwort in resp speichern
      if (resp.ok) {
        element.innerHTML = await resp.text(); // Der ganze string aus header.html ist dadrinne gespeichert.
      } else {
        element.innerHTML = "Page not found";
      }
    }
  }