document.addEventListener("DOMContentLoaded", function () {
  const crmMenu = document.querySelector(".has-submenu > span");
  const submenu = document.querySelector(".has-submenu .submenu");

  if (crmMenu && submenu) {
    crmMenu.addEventListener("click", function (e) {
      e.stopPropagation();
      submenu.classList.toggle("submenu-open");
    });

    document.addEventListener("click", function () {
      submenu.classList.remove("submenu-open");
    });

    submenu.addEventListener("click", function (e) {
      e.stopPropagation();
    });
  }
});





