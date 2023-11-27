
let btns = ["summary", "add_task", "board", "contacts"];

async function init() {
    await includeHTML('summary.html');
}

async function includeHTML(file) {
    let container = document.querySelector('.include'); // Container auswählen, in den der Inhalt geladen werden soll
    let resp = await fetch(file); // Anfrage an die Datei zum Laden
    if (resp.ok) {
        let newContent = await resp.text(); // Den Inhalt der Datei abrufen
        while (container.firstChild) {
            container.removeChild(container.firstChild); // Vorherigen Inhalt entfernen
        }
        let div = document.createElement('div'); // Neues DIV-Element erstellen
        div.innerHTML = newContent; // Neuen Inhalt in das DIV-Element einfügen
        container.appendChild(div); // DIV-Element dem Container hinzufügen
        init_include(file);
    } else {
        let div = document.createElement('div');
        div.innerHTML = 'Page not found';
        container.appendChild(div);
    }
}

function init_include(name){
    let functionName = name.split('.')[0] + '_init';

    // Überprüfe, ob die Funktion existiert, bevor du sie aufrufst
    if (typeof window[functionName] === 'function') {
        window[functionName]();
    } else {
        console.error(`Die Funktion ${functionName} existiert nicht.`);
    }
}



async function menue_clicked(name){
    for (let i = 0; i < btns.length; i++) {
        const element = btns[i];
        document.getElementById(element).classList.remove('btn_clicked');
    }
    document.getElementById(name).classList.add('btn_clicked');
    await includeHTML(name + '.html');
}

function toggleMenu() {
    document.getElementById('popup_menu').classList.remove('display_none');
    let close = function() {
        closeMenuOutsideClick();
    };
    document.getElementById('include').onclick = close;
    document.getElementById('side_bar').onclick = close;
}
function closeMenuOutsideClick() {
    document.getElementById('popup_menu').classList.add('display_none');
    document.getElementById('include').onclick = null;
    document.getElementById('side_bar').onclick = null;
}
