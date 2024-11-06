const nameElement = document.getElementById("name");
const roll = document.getElementById("roll");
const firstName = document.getElementById("first-name");
const date = document.getElementById("date");

fetch("/api/userdata")
  .then((response) => response.json())
  .then((data) => {
    nameElement.textContent = data.name;
    roll.textContent = data.roll;
    firstName.textContent = data.name.split(" ")[0];
  });

Currentdate.textContent = new Date().toDateString();
