
function init(){
    console.log("test")
    load_numbers();
    render_greeting();
}

function load_numbers(){
    
}

function render_greeting(){
    function updateTime(){
        let currentTime = new Date();
        let currenthour = currentTime.getHours();
        console.log(currenthour);
    }
    setInterval(updateTime, 5000);
}
