/**
 * Initializes the 'summary' page by calling necessary functions.
 * Calls 'set_name' to display the user's name on the page.
 * Calls 'load_numbers' to load relevant numbers or data on the page.
 * Calls 'updateTime' to update the greeting message based on the current time.
 */
async function summary_init(){
    await get_all_user();
    set_name();
    load_numbers();
    updateTime();
}

/**
 * Sets the user's name on the webpage.
 * Retrieves the user's name from the 'all_user' array based on the logged-in email.
 * Displays a greeting message with the full name and a shortened version with initials.
 */
function set_name(){
    let name;
    for (let i = 0; i < all_user.length; i++) {
        const element = all_user[i];
        if (element['email'] == Email)
        {
            name = element['name']
            break ;
        }
    }
    document.getElementById('greeting_name').innerHTML = name;
    const name_parts = name.split(" ");
    let firt_name = name_parts[0].charAt(0).toUpperCase();
    let second_name = "";
    if (name_parts.length > 1) {
        second_name = name_parts[name_parts.length - 1].charAt(0).toUpperCase();
      }
    document.getElementById('name').innerHTML = firt_name + second_name;
}

function load_numbers(){
    for (let i = 0; i < all_user.length; i++) {
        const element = all_user[i];
        if (element['email'] == Email)
        {
            let tasks = element['tasks'];
            console.log(tasks);
            render_numbers(tasks);
            break ;
        }
    }  
}

function render_numbers(tasks){
    document.getElementById('to_do_nb').innerHTML = tasks[0]['to_do'].length;
    document.getElementById('done_nb').innerHTML = tasks[0]['done'].length;
    document.getElementById('board_nb').innerHTML = tasks.length;
    document.getElementById('progrss_nb').innerHTML = tasks[0]['in_progress'].length;
    document.getElementById('feedback_nb').innerHTML = tasks[0]['feedback'].length;
    let count = 0;
    for (let i = 0; i < tasks.length; i++) {
        const element = tasks[i];
        if (element['done'][0]['prio'] == "urgent")
            count++;
        if (element['to_do'][0]['prio'] == "urgent")
            count++;
        if (element['in_progress'][0]['prio'] == "urgent")
            count++;
        if (element['feedback'][0]['prio'] == "urgent")
            count++;
    }
    document.getElementById('urgent_nb').innerHTML = count;
    render_deadline(tasks);
}

function render_deadline(tasks){
    let dates = [];
    for (let i = 0; i < tasks.length; i++) {
        const element = tasks[i];
        dates.push(element['done'][0]['due']);
        dates.push(element['to_do'][0]['due']);
        dates.push(element['in_progress'][0]['due']);
        dates.push(element['feedback'][0]['due']);
    }
    let current_date =new Date();
    current_date.setHours(0, 0, 0, 0);
    function parseDate(dateString) {
        let parts = dateString.split('.');
        return new Date(parts[2], parts[1] - 1, parts[0]);
    }

    let futureDates = dates.filter(date => {
        let taskDate = parseDate(date);
        return taskDate > current_date;
    });
    futureDates.sort((a, b) => parseDate(a) - parseDate(b));
    let nextDueDate = futureDates.length > 0 ? futureDates[0] : null;
    console.log(nextDueDate);
}

/**
 * Updates the greeting message based on the current time of day.
 * Retrieves the current hour and displays an appropriate greeting message.
 */
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
