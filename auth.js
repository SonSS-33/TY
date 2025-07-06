// auth-check.js
(function checkAuth() {
    if (localStorage.getItem("isLoggedIn") !== "true") {
      window.location.href = "login.html";
    }
  })();