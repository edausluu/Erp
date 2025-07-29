document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("loginForm");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;
      const errorText = document.getElementById("loginError");

      if (username === "admin" && password === "1234") {
        window.location.href = "panel.html";
      } else {
        errorText.textContent = "Kullanıcı adı veya şifre hatalı.";
      }
    });
  }
});





