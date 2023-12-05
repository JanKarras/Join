
async function summary_init(){
    load_numbers();
    updateTime();
}

function load_numbers(){
    
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
