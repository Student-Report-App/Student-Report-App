const loginBtn = document.getElementById("login-btn");
const errorMessage = document.getElementById("error-message");
const remember = document.getElementById("remember");

const checkExists = async (type, value) => {
  try {
    const response = await fetch(`/auth/check${type}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ [type.toLowerCase()]: value.trim() }),
    });

    const data = await response.json();
    return data.exists;
  } catch (error) {
    errorMessage.innerText = "An error occurred while checking the database";
    return false;
  }
};

const passwordMatch = async (login, password, loginType, checked) => {
  try {
    const response = await fetch("/auth/checkPassword", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        login: login.trim(),
        password: password.trim(),
        loginType,
        checked,
      }),
    });

    const data = await response.json();
    return data.match;
  } catch (error) {
    errorMessage.innerText = "An error occurred while checking the password";
    return false;
  }
};

const handleLogin = async (e) => {
  e.preventDefault();
  const login = document.getElementById("login").value.trim();

  const emailRegex = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/;
  const loginType = login.match(emailRegex) ? "Email" : "Username";
  const exists = await checkExists(loginType, login);

  if (exists) {
    const password = document.getElementById("password").value.trim();
    const passwordMatched = await passwordMatch(
      login,
      password,
      loginType,
      remember.checked,
    );
    if (passwordMatched) {
      document.getElementById("login-form").submit();
    } else {
      errorMessage.innerText = "The password you entered is incorrect";
    }
  } else {
    errorMessage.innerText = `${loginType} not found`;
  }
};

loginBtn.addEventListener("click", handleLogin);

document
  .getElementById("toggle-password")
  .addEventListener("click", function () {
    const passwordInput = document.getElementById("password");
    const icon = this.querySelector("i");
    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      icon.classList.remove("fa-eye");
      icon.classList.add("fa-eye-slash");
    } else {
      passwordInput.type = "password";
      icon.classList.remove("fa-eye-slash");
      icon.classList.add("fa-eye");
    }
  });
