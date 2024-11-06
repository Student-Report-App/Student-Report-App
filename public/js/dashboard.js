const nameElement = document.getElementById("name");
const roll = document.getElementById("roll");
const firstName = document.getElementById("first-name");
const currentDate = document.getElementById("current-date");
const logoutBtn = document.getElementById("logout");

logoutBtn.addEventListener("click", () => {
  fetch("/auth/logout", {
    method: "POST",
  }).then(() => location.href = "/");
});

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

fetch("/api/userdata")
  .then((response) => response.json())
  .then((data) => {
    nameElement.textContent = data.name;
    roll.textContent = data.roll;
    firstName.textContent = data.name.split(" ")[0];
  });

currentDate.textContent = new Date().toDateString();

const today = days[new Date().getDay() - 1];
const classItems = Array.from(document.querySelectorAll(".class-item"));
fetch(`/api/timetable/CSE/${today}`)
  .then((response) => response.json())
  .then((data) => {
    classItems.forEach((item, index) => {
      const subject = data[index];
      if (subject && subject !== null) {
        item.textContent = subject;
      } else {
        item.textContent = "Free";
        item.style.backgroundColor = "#16E838";
      }
    });
  });
