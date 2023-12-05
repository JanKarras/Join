function toggleMenu() {
  document.getElementById("popup_menu").classList.remove("display_none");
  let close = function () {
    closeMenuOutsideClick();
  };
  document.getElementById("side_bar").onclick = close;
  document.getElementById("content").onclick = close;
  document.getElementById("headline_header").onclick = close;
}

function closeMenuOutsideClick() {
  document.getElementById("popup_menu").classList.add("display_none");
  document.getElementById("side_bar").onclick = null;
  document.getElementById("content").onclick = null;
  document.getElementById("headline_header").onclick = null;
}