const fullName = document.getElementById("name");
const roll = document.getElementById("roll");
const username = document.getElementById("username");
const email = document.getElementById("email");
const errorMessage = document.getElementById("error-message");
const submitBtn = document.getElementById("submit-btn");

const curYear = Number(String(new Date().getFullYear()).slice(2));

const updateUsernameAndEmail = () => {
  username.value =
    fullName.value.split(" ")[0].toLowerCase() + roll.value.slice(0, 5);
  email.value = username.value + "@iiitnr.edu.in";
};

const updateYearAndBranch = () => {
  const year = String(roll.value).slice(0, 2);
  const yearMap = {
    [curYear]: "1st",
    [curYear - 1]: "2nd",
    [curYear - 2]: "3rd",
    [curYear - 3]: "4th",
  };
  const branchMap = {
    0: "CSE",
    1: "ECE",
    2: "DSAI",
  };

  if (yearMap[year]) {
    document.getElementById(yearMap[year]).checked = true;
  }

  if (branchMap[roll.value[4]]) {
    document.getElementById(branchMap[roll.value[4]]).checked = true;
  }
};

const checkExists = async (type, value) => {
  const response = await fetch(`/auth/check${type}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ [type.toLowerCase()]: value }),
  });

  const data = await response.json();
  if (data.exists) {
    errorMessage.innerText = `${type} already taken`;
    return true;
  } else {
    errorMessage.innerText = "";
    return false;
  }
};

const initializeEventListeners = () => {
  fullName.addEventListener("input", updateUsernameAndEmail);
  roll.addEventListener("input", () => {
    updateYearAndBranch();
    updateUsernameAndEmail();
  });

  username.addEventListener("input", async () => {
    await checkExists("Username", username.value);
  });
  email.addEventListener("input", async () => {
    await checkExists("Email", email.value);
  });

  submitBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    if (
      fullName.value.trim() !== "" &&
      roll.value.trim() !== "" &&
      username.value.trim() !== "" &&
      email.value.trim() !== ""
    ) {
      const isUsernameTaken = await checkExists("Username", username.value);
      const isEmailTaken = await checkExists("Email", email.value);
      if (!isUsernameTaken && !isEmailTaken)
        document.getElementById("register-form").submit();
    } else {
      errorMessage.innerText = "Please fill in all fields.";
    }
  });
};

initializeEventListeners();
