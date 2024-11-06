const loginBtn = document.getElementById("login-btn");
const errorMessage = document.getElementById("error-message");

const checkExists = async (type, value) => {
  try {
    const response = await fetch(`/auth/check${type}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ [type.toLowerCase()]: value }),
    });

    const data = await response.json();
    if (!data.exists) {
      errorMessage.innerText = `${type} not found in database`;
      return false;
    }
    return true;
  } catch (error) {
    errorMessage.innerText = "An error occurred while checking the database";
    return false;
  }
};

const passwordMatch = async (login, password, loginType) => {
  try {
    const response = await fetch("/auth/checkPassword", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ login, password, loginType }),
    });

    const data = await response.json();
    if (!data.match) {
      errorMessage.innerText = "Password is incorrect";
      return false;
    }
    return true;
  } catch (error) {
    errorMessage.innerText = "An error occurred while checking the password";
    return false;
  }
};

const handleLogin = async (e) => {
  e.preventDefault();
  const login = document.getElementById("login").value;

  const emailRegex = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/;
  const loginType = login.match(emailRegex) ? "Email" : "Username";
  const exists = await checkExists(loginType, login);

  if (exists) {
    const password = document.getElementById("password").value;
    const passwordMatched = await passwordMatch(login, password, loginType);
    if (passwordMatched) {
      document.getElementById("login-form").submit();
    } else {
      errorMessage.innerText = "The password you entered is incorrect";
    }
  } else {
    errorMessage.innerText = `This ${loginType} is not associated with any account on our platform`;
  }
};

loginBtn.addEventListener("click", handleLogin);
