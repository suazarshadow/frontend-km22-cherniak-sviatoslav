const validUsername = "admin";
const validPassword = "1234";

const validUsername1 = "user"
const validPassword1 = "1234"

window.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const errorMessage = document.getElementById("errorMessage");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    if (!username || !password) {
      errorMessage.textContent = "Будь ласка, заповніть усі поля.";
      return;
    }

    localStorage.setItem("loggedInUser", username);

    if (username === validUsername && password === validPassword) {
      window.location.href = "admin.html";
    } else if (username === validUsername1 && password === validPassword1) {
      window.location.href = "userui.html";
    } else {
      errorMessage.textContent = "Невірний логін або пароль.";
    }
  });
});