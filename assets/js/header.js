/**
 * Toggles the visibility of the popup menu by adding or removing the 'display_none' class.
 * Attaches event listeners to close the menu when clicking outside of it.
 */
function toggleMenu() {
  document.getElementById("popup_menu").classList.toggle("d-none");
  let close = function () {
    closeMenuOutsideClick();
  };
  document.getElementById("side_bar").onclick = close;
  document.getElementById("content").onclick = close;
  document.getElementById("headline_header").onclick = close;
}

/**
 * Closes the popup menu when clicking outside of it.
 * Adds the 'display_none' class to hide the menu and removes event listeners.
 */
function closeMenuOutsideClick() {
  document.getElementById("popup_menu").classList.add("d-none");
  document.getElementById("side_bar").onclick = null;
  document.getElementById("content").onclick = null;
  document.getElementById("headline_header").onclick = null;
}

/**
 * Logs the user out by redirecting to the 'index.html' page.
 */
function logOut() {
  window.location.href = "index.html";
}
