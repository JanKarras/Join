
async function show_deatil(number){
    let resp = await fetch(`https://pokeapi.co/api/v2/pokemon/${number + 1}`);
    pokemon = await (resp.json());
    document.getElementById
    render_show_detail(pokemon);
}

function render_show_detail(pokemon)
{
    document.getElementById('name-deatil').innerHTML = erstesZeichenGroßschreiben(pokemon['name']);
    if(pokemon['types'].length == 2)
    {
        document.getElementById('type1-detail').innerHTML = erstesZeichenGroßschreiben(pokemon['types'][0]['type']['name']);
        document.getElementById('type2-detail').innerHTML = erstesZeichenGroßschreiben(pokemon['types'][1]['type']['name']);
    }
    else
    {
        document.getElementById('type1-detail').innerHTML = erstesZeichenGroßschreiben(pokemon['types'][0]['type']['name']);
    }
    document.getElementById('id-detail').innerHTML = '#' + formatierePokemonID(pokemon['id']);
    let body_detail = document.getElementById('body');
    for (let j = 0; j < types_color_array.length; j++) {
        if(types_color_array[j]['type'] == pokemon['types'][0]['type']['name'])
        {
            body_detail.style.backgroundColor = types_color_array[j]['colorCode'];
            break;
        }
    }
    document.getElementById('img_detail').src = pokemon['sprites']['front_default'];
    load_about(pokemon)
    load_stats(pokemon)
    load_evolution(pokemon)
    load_moves(pokemon)
    move_nav('about');
}

async function load_about(pokemon){
    let resp = await fetch(pokemon['species']['url'])
    let species = await (resp.json());
    document.getElementById('species').innerHTML = erstesZeichenGroßschreiben(species['genera'][7]['genus']);
    document.getElementById('height').innerHTML = pokemon['height']*10 + ' cm';
    document.getElementById('weigth').innerHTML = pokemon['weight']/10 + ' kg';
    document.getElementById('abilities').innerHTML = '';
    for (let i = 0; i < pokemon['abilities'].length; i++) {
        let abilities = document.getElementById('abilities')
        abilities.innerHTML += erstesZeichenGroßschreiben(pokemon['abilities'][i]['ability']['name']);
        if(i != pokemon['abilities'].length - 1)
        {
            abilities.innerHTML += ', ';
        }
    }
    document.getElementById('gender').innerHTML = species['gender_rate']/8 * 100 + ' % female, '
    document.getElementById('gender').innerHTML += 100 - species['gender_rate']/8 * 100 + ' % male'
    document.getElementById('egg_groups').innerHTML = '';
    for (let i = 0; i < species['egg_groups'].length; i++) {
        let abilities = document.getElementById('egg_groups')
        abilities.innerHTML += erstesZeichenGroßschreiben(species['egg_groups'][i]['name']);
        if(i != species['egg_groups'].length - 1)
        {
            abilities.innerHTML += ', ';
        }
    }
    document.getElementById('egg_cycle').innerHTML = species['hatch_counter'] + ` (${species['hatch_counter'] * 255}) steps`
}

function load_stats(pokemon){
    let total = 0;
   for (let i = 0; i < 6; i++) {
        const statElement = document.getElementById('stat' + i)
        if(statElement)
        {
            statElement.innerHTML = pokemon['stats'][i]['base_stat'];
            total = total + parseInt(statElement.innerHTML, 10);
        }
        const barElement = document.getElementById('progress' + i)
        barElement.style.width = (pokemon['stats'][i]['base_stat']/150)*100 + '%';
   }
   document.getElementById('stat6').innerHTML = total;
   document.getElementById('progress6').style.width = (total/1000)*100 + '%';
}

async function load_evolution(pokemon){
    let resp = await fetch(pokemon['species']['url'])
    let species = await (resp.json());
    console.log(species)
    resp = await fetch(species['evolution_chain']['url'])
    let evulution_chain = await (resp.json());
    console.log(evulution_chain)
    const link = evulution_chain['chain']['species']['url'];
    const number = parseInt(link.split('/').slice(-2, -1)[0]);
    const size = evolution_size(evulution_chain);
    await render_evolution(size)
    let names = get_names(evulution_chain, size);
    for (let i = 0; i < size; i++) {
        const evoimg = document.getElementById(`${i}EvoImg`);
        const evoname = document.getElementById(`${i}EvoName`);
        evoimg.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${number + i}.png`;
        evoname.innerHTML = names[i];
        if(i == 1 && size == 3)
        {
            document.getElementById(`3EvoImg`).src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${number + i}.png`;
            document.getElementById(`3EvoName`).innerHTML = names[i];
        }
        let flag = document.getElementById('0to1Lv');
        if ( flag != null)
            flag.innerHTML = evulution_chain['chain']['evolves_to'][0]['evolution_details'][0]['min_level']
        flag = document.getElementById('1to2Lv');
        if ( flag != null)
            flag.innerHTML = evulution_chain['chain']['evolves_to'][0]['evolves_to'][0]['evolution_details'][0]['min_level']
    }
}

async function render_evolution(size){
    let content = document.getElementById('evolution')
    content.innerHTML = '';
    content.innerHTML = `<div id="first-evolution"></div>`;
    if(size == 3)
        content.innerHTML += `<div id="second-evolution"></div>`;
    content = document.getElementById('first-evolution');
    content.innerHTML = `
        <div>
            <img id ="0EvoImg"src="">
            <h3 id ="0EvoName"></h3>
        </div>
        `;
    if(size >= 2)
    {
        content.innerHTML += `
            <div id="arrow1" class="arrow">
                <span id="0to1Lv"></span>
            </div>   
            <div>
                <img id ="1EvoImg"src="">
                <h3 id ="1EvoName"></h3>
            </div>
            `;
    }
    if(size == 3)
    {
        content = document.getElementById('second-evolution')
        content.innerHTML = `
            <div>
                <img id ="3EvoImg" src="">
                <h3 id ="3EvoName"></h3>
            </div>
            <div id="arrow2" class="arrow">
                <span id="1to2Lv"></span>
            </div>
                <div>
                    <img id ="2EvoImg" src="">
                    <h3 id ="2EvoName"></h3>
                </div>
            `;
    }

}

function get_names(evolution_chain, size){
    let names = [];
    if(size >= 1)
        names.push(erstesZeichenGroßschreiben(evolution_chain['chain']['species']['name']));
    if(size >= 2)
        names.push(erstesZeichenGroßschreiben(evolution_chain['chain']['evolves_to'][0]['species']['name']));
    if(size == 3)
        names.push(erstesZeichenGroßschreiben(evolution_chain['chain']['evolves_to'][0]['evolves_to'][0]['species']['name']));
    return names;
}

function evolution_size(evulution_chain){
    let counter = 1;
    if(evulution_chain['chain']['evolves_to'].length != 0)
    {
        counter = counter + 1;
        if(evulution_chain['chain']['evolves_to'][0]['evolves_to'].length != 0)
        {
            counter = counter + 1;
        }
    }
    return counter;
}

async function load_moves(pokemon){
    let moves = get_moves(pokemon)
    console.log(moves);
    let content = document.getElementById('moves_list')
    content.innerHTML = '';
    for (let i = 0; i < moves.length; i++) {
        const name = moves[i]['name'];
        const lv = moves[i]['lv']
        content.innerHTML += `
                <li class="moves_list_element">
                    <div>${lv}</div>
                    <div>${erstesZeichenGroßschreiben(name)}</div>
                </li>
            `
    }
}

function get_moves(pokemon) {
    let moves = [];
  
    for (let i = 0; i < pokemon['moves'].length; i++) {
      const move = pokemon['moves'][i];
      const method = move['version_group_details'][0]['move_learn_method']['name'];
  
      if (method === "level-up") {
        const moveData = {
          name: move['move']['name'],
          lv: move['version_group_details'][0]['level_learned_at']
        };
        moves.push(moveData);
      }
    } 
    moves.sort((a, b) => a.lv - b.lv);
    return moves;
}
  

function close_detail(){
    document.getElementById('pokedex').classList.remove('display-none');
    document.getElementById('pokedex').classList.add('display');
    document.getElementById('showdetail').classList.remove('display');
    document.getElementById('showdetail').classList.add('display-none');
    document.getElementById('body').style.backgroundColor = 'white';
    document.getElementById('body').classList.remove('overflow');
}

function move_nav(sectionName) {
    document.querySelectorAll('.about, .stats, .evolution, .moves').forEach((section) => {
      section.classList.remove('active');
    });
    document.getElementById('nav-about').classList.add('lightgray');
    document.getElementById('nav-stats').classList.add('lightgray');
    document.getElementById('nav-evolution').classList.add('lightgray');
    document.getElementById('nav-moves').classList.add('lightgray');
    document.getElementById(`nav-${sectionName}`).classList.remove('lightgray');
    const selectedSection = document.querySelector(`#${sectionName}`);
    if (selectedSection) {
      selectedSection.classList.add('active');
    }
}
  