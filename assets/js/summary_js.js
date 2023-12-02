
async function summary_init(){
    await includeHTML();
    menue_clicked('summary');
    load_numbers();
    updateTime();
}

function load_numbers(){
    
}

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

function updateTime(){
    let currentTime = new Date();
    let currenthour = currentTime.getHours();
    if (currenthour < 12){
        document.getElementById('greeting').innerHTML = "Good morning";
    } else if (currenthour > 12 && currenthour < 14){
        document.getElementById('greeting').innerHTML = "Good noon";
    } else if (currenthour > 14 && currenthour < 18){
        document.getElementById('greeting').innerHTML = "Good afternoon";
    } else if (currenthour > 18)
        document.getElementById('greeting').innerHTML = "Good evening";
}
