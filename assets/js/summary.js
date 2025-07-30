/**
 * Initializes the 'summary' page by calling necessary functions.
 * Calls 'setName' to display the user's name on the page.
 * Calls 'loadNumbers' to load relevant numbers or data on the page.
 * Calls 'updateTime' to update the greeting message based on the current time.
 */
async function summaryInit() {
  await getAllUser();
  setName();
  loadNumbers();
  updateTime();
}

/**
 * Sets the user's name on the webpage.
 * Retrieves the user's name from the 'allUser' array based on the logged-in email.
 * Displays a greeting message with the full name and a shortened version with initials.
 */
function setName() {
  let name;
  for (let i = 0; i < allUser.length; i++) {
    const element = allUser[i];
    if (element["email"] == Email) {
      name = element["name"];
      break;
    }
  }
  document.getElementById("greeting_name").innerHTML = name;
  const name_parts = name.split(" ");
  let firt_name = name_parts[0].charAt(0).toUpperCase();
  let second_name = "";
  if (name_parts.length > 1) {
    second_name = name_parts[name_parts.length - 1].charAt(0).toUpperCase();
  }
  document.getElementById("name").innerHTML = firt_name + second_name;
}

/**
 * load the numbers of the tasks_sum
 */
function loadNumbers() {
  for (let i = 0; i < allUser.length; i++) {
    const element = allUser[i];
    if (element["email"] == Email) {
      let tasks_sum = element["tasks"];
      renderNumbers(tasks_sum);
      break;
    }
  }
}

/**
 * Rendert die Anzahl der Aufgaben in verschiedenen Kategorien und Informationen zu dringenden Aufgaben.
 * @param {Array} tasks_sum - the users array of the tasks_sum
 */
function renderNumbers(tasks_sum) {
  if (tasks_sum.length != 0) {
    document.getElementById("to_do_nb").innerHTML = tasks_sum[0]["todo"].length;
    document.getElementById("done_nb").innerHTML = tasks_sum[0]["done"].length;
    document.getElementById("board_nb").innerHTML = tasks_sum[0]["todo"].length + tasks_sum[0]["done"].length + tasks_sum[0]["in_progress"].length + tasks_sum[0]["feedback"].length;
    document.getElementById("progrss_nb").innerHTML =
      tasks_sum[0]["in_progress"].length;
    document.getElementById("feedback_nb").innerHTML =
      tasks_sum[0]["feedback"].length;
    let count = 0;
    for (let i = 0; i < tasks_sum[0]["feedback"].length; i++) {
      const element = tasks_sum[0]["feedback"][i];
      if (element["prio"] == "urgent") count++;
    }
    for (let i = 0; i < tasks_sum[0]["todo"].length; i++) {
      const element = tasks_sum[0]["todo"][i];
      if (element["prio"] == "urgent") count++;
    }
    for (let i = 0; i < tasks_sum[0]["in_progress"].length; i++) {
      const element = tasks_sum[0]["in_progress"][i];
      if (element["prio"] == "urgent") count++;
    }
    document.getElementById("urgent_nb").innerHTML = count;
    renderDeadline(tasks_sum);
  }
}

/**
 * Render the next due date based on task summaries and update the HTML element with id "deadline".
 *
 * @param {Array} tasks_sum - An array containing task summaries.
 */
function renderDeadline(tasks_sum) {
  const dates = getAllDueDates(tasks_sum);
  const futureDates = getFutureDates(dates);
  const nextDueDate = getNextDueDate(futureDates);

  updateDeadlineElement(nextDueDate);
}

/**
 * Extracts all due dates from different task statuses.
 *
 * @param {Array} tasks_sum - An array containing task summaries.
 * @returns {Array} - An array of due dates.
 */
function getAllDueDates(tasks_sum) {
  let dates = [];
  ["todo", "feedback", "in_progress"].forEach((status) => {
    dates = dates.concat(tasks_sum[0][status].map((task) => task.due));
  });
  return dates;
}

/**
 * Filters out past dates and returns an array of future due dates.
 *
 * @param {Array} dates - An array of due dates.
 * @returns {Array} - An array of future due dates.
 */
function getFutureDates(dates) {
  const current_date = new Date();
  current_date.setHours(0, 0, 0, 0);

  return dates.filter((date) => {
    let taskDate = parseDate(date);
    return taskDate > current_date;
  });
}

/**
 * Finds and returns the next due date from an array of future due dates.
 *
 * @param {Array} futureDates - An array of future due dates.
 * @returns {Date|null} - The next due date or null if none exists.
 */
function getNextDueDate(futureDates) {
  futureDates.sort((a, b) => parseDate(a) - parseDate(b));
  return futureDates.length > 0 ? parseDate(futureDates[0]) : null;
}

/**
 * Parses a date string in the format "YYYY-MM-DD" and returns a Date object.
 *
 * @param {string} dateString - A string representing a date in "YYYY-MM-DD" format.
 * @returns {Date} - A Date object parsed from the input string.
 */
function parseDate(dateString) {
  const parts = dateString.split("-");
  return new Date(parts[0], parts[1] - 1, parts[2]);
}

/**
 * Updates the HTML element with id "deadline" based on the provided due date.
 *
 * @param {Date|null} nextDueDate - The next due date or null if none exists.
 */
function updateDeadlineElement(nextDueDate) {
  const formattedDate = nextDueDate
    ? nextDueDate.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "No";
  document.getElementById("deadline").innerHTML = formattedDate;
}

/**
 * Updates the greeting message based on the current time of day.
 * Retrieves the current hour and displays an appropriate greeting message.
 */
function updateTime() {
  let currentTime = new Date();
  let currenthour = currentTime.getHours();
  if (currenthour < 12) {
    document.getElementById("greeting").innerHTML = "Good morning";
  } else if (currenthour > 12 && currenthour < 14) {
    document.getElementById("greeting").innerHTML = "Good afternoon";
  } else if (currenthour > 14 && currenthour < 18) {
    document.getElementById("greeting").innerHTML = "Good afternoon";
  } else if (currenthour > 18)
    document.getElementById("greeting").innerHTML = "Good evening";
}
