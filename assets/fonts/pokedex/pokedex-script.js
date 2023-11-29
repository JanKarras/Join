let allpokemons = [];
let count = 0;
let types_color_array = [
    { "type": "normal", "colorCode": "#B4BAC4", "colorCode_type": "rgba(168, 168, 120, 0.7)" },
    { "type": "fire", "colorCode": "#FB6C6C", "colorCode_type": "rgba(240, 128, 48, 0.7)" },
    { "type": "water", "colorCode": "#72B9FC", "colorCode_type": "rgba(104, 144, 240, 0.7)" },
    { "type": "grass", "colorCode": "#46D1B1", "colorCode_type": "rgba(120, 200, 80, 0.7)" },
    { "type": "electric", "colorCode": "#FFD86F", "colorCode_type": "rgba(248, 208, 48, 0.7)" },
    { "type": "ice", "colorCode": "#98D8D8", "colorCode_type": "rgba(152, 216, 216, 0.7)" },
    { "type": "fighting", "colorCode": "#C03028", "colorCode_type": "rgba(192, 48, 40, 0.7)" },
    { "type": "poison", "colorCode": "#9F6E97", "colorCode_type": "rgba(160, 64, 160, 0.7)" },
    { "type": "ground", "colorCode": "#F78551", "colorCode_type": "rgba(224, 192, 104, 0.7)" },
    { "type": "flying", "colorCode": "#A890F0", "colorCode_type": "rgba(168, 144, 240, 0.7)" },
    { "type": "psychic", "colorCode": "#F85888", "colorCode_type": "rgba(248, 88, 136, 0.7)" },
    { "type": "bug", "colorCode": "#64DD16", "colorCode_type": "rgba(168, 184, 32, 0.7)" },
    { "type": "rock", "colorCode": "#B8A038", "colorCode_type": "rgba(184, 160, 56, 0.7)" },
    { "type": "ghost", "colorCode": "#705898", "colorCode_type": "rgba(112, 88, 152, 0.7)" },
    { "type": "dragon", "colorCode": "#7038F8", "colorCode_type": "rgba(112, 56, 248, 0.7)" },
    { "type": "dark", "colorCode": "#705848", "colorCode_type": "rgba(112, 88, 72, 0.7)" },
    { "type": "steel", "colorCode": "#B8B8D0", "colorCode_type": "rgba(184, 184, 208, 0.7)" },
    { "type": "fairy", "colorCode": "#EE99AC", "colorCode_type": "rgba(238, 153, 172, 0.7)" }
];
let generations = [151, 100, 135, 107, 156, 72, 88, 89, 112]
async function init(number){
    document.getElementById('headline').innerHTML = 'Pokedex ' + document.getElementById(`menu-button${number}`).innerHTML;
    await loadpokemons(`https://pokeapi.co/api/v2/generation/${number + 1}/`)
    await loadpokemon(number);
}

function toggleMenu() {
    const menu = document.getElementById("menu");
    
    if (menu.classList.contains("hidden")) {
        menu.classList.remove("hidden");
        menu.classList.add("visible");
    } else {
        menu.classList.remove("visible");
        menu.classList.add("hidden");
    }
}

async function loadpokemons(url)
{
    let resp = await fetch(url);
    let array = await (resp.json());
    await fill_array(array);
}

async function fill_array(array)
{
    let results = array['pokemon_species'];
    for (let i = 0; i < results.length; i++) {
        const element = results[i];
        allpokemons.push(element['url']);
        count++;
    }
}

async function loadpokemon(gen)
{
    
    let content = document.getElementById('content')
    content.innerHTML = '';
    let sum_gen = sum(gen,true)
    for (let i = sum(gen,false); i < sum_gen; i++) {
        let resp = await fetch(`https://pokeapi.co/api/v2/pokemon/${i + 1}`);
        let pokemon = await (resp.json());
        content.innerHTML += `
        <div onclick="select_pokemon(${i})" class="card" id="card${i}">
            <div class="id" id="id${i}"></div>
            <h2 id="name${i}"></h2>
            <div class="type_img_container">
                <div class="type-container">
                    <div class="type" id="type1${i}"></div>
                    <div class="type" id="type2${i}"></div>
                </div>
                <img class="img" id="img${i}" src="" loading="lazy">
            </div>
        </div>
        `;
        renderdetails(pokemon, i);
    }
}

function sum(gen, bool)
{
    if(bool == true)
    {
        let number = 0;
        for (let i = 0; i < gen + 1; i++) {
            number = number + generations[i];
        }
        return number;
    }
    else
    {
        let number = 0;
        for (let i = 0; i < gen + 1; i++) {
            number = number + generations[i];
        }
        number = number - generations[gen];
        return number
    }
}

function erstesZeichenGroßschreiben(text) {
    if (text.length === 0) {
      return "";
    }
    const ersterBuchstabeGroß = text[0].toUpperCase();
    return ersterBuchstabeGroß + text.slice(1);
  }

function renderdetails(pokemon, i){
    document.getElementById('id'+i).innerHTML = '#' + formatierePokemonID(pokemon['id']);
        document.getElementById('name'+i).innerHTML = erstesZeichenGroßschreiben(pokemon['name']);
        if(pokemon['types'].length == 2)
        {
            document.getElementById('type1'+i).innerHTML = erstesZeichenGroßschreiben(pokemon['types'][0]['type']['name']);
            document.getElementById('type2'+i).innerHTML = erstesZeichenGroßschreiben(pokemon['types'][1]['type']['name']);
            addcolor(pokemon['types'][0]['type']['name'], i);
        }
        else
        {
            document.getElementById('type1'+i).innerHTML = erstesZeichenGroßschreiben(pokemon['types'][0]['type']['name']);    
            addcolor(pokemon['types'][0]['type']['name'], i);
        }
        document.getElementById('img'+i).src = pokemon['sprites']['front_default'];
}

function addcolor(type, i){
    let card = document.getElementById('card'+i)
    for (let j = 0; j < types_color_array.length; j++) {
        if(types_color_array[j]['type'] == type)
        {
            card.style.backgroundColor = types_color_array[j]['colorCode'];
            break;
        }
    }
}

function formatierePokemonID(id) {
    return id.toString().padStart(4, '0');
  }

async function select_pokemon(i)
{
    document.getElementById('pokedex').classList.add('display-none');
    document.getElementById('pokedex').classList.remove('display');
    document.getElementById('showdetail').classList.add('display');
    document.getElementById('showdetail').classList.remove('display-none');
    document.getElementById('spezefic_information').classList.add('display');
    document.getElementById('spezefic_information').classList.remove('display-none');
    document.getElementById('body').classList.add('overflow');
    show_deatil(i);
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