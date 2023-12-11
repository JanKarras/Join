/**
 * Initializes the 'summary' page by calling necessary functions.
 * Calls 'set_name' to display the user's name on the page.
 * Calls 'load_numbers' to load relevant numbers or data on the page.
 * Calls 'updateTime' to update the greeting message based on the current time.
 */
async function summary_init(){
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
