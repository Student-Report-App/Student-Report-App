const fullName = document.getElementById("name");
const roll = document.getElementById("roll");
const username = document.getElementById("username");
const email = document.getElementById("email");

const curYear = Number(String(new Date().getFullYear()).slice(2));

fullName.addEventListener("input", () => {
  username.value =
    fullName.value.split(" ")[0].toLowerCase() + roll.value.slice(0, 5);
  email.value =
    fullName.value.split(" ")[0].toLowerCase() +
    roll.value.slice(0, 5) +
    "@iiitnr.edu.in";
});
roll.addEventListener("input", () => {
  const year = String(roll.value).slice(0, 2);
  if (year == curYear) {
    document.getElementById("1st").checked = true;
  } else if (year == curYear - 1) {
    document.getElementById("2nd").checked = true;
  } else if (year == curYear - 2) {
    document.getElementById("3rd").checked = true;
  } else if (year == curYear - 3) {
    document.getElementById("4th").checked = true;
  }

  if (roll.value[4] == "0") {
    document.getElementById("cse").checked = true;
} else if (roll.value[4] == "2") {
  document.getElementById("ece").checked = true;
  } else if (roll.value[4] == "4") {
    document.getElementById("dsai").checked = true;
  }
  username.value =
    fullName.value.split(" ")[0].toLowerCase() + roll.value.slice(0, 5);
  email.value =
    fullName.value.split(" ")[0].toLowerCase() +
    roll.value.slice(0, 5) +
    "@iiitnr.edu.in";
});
