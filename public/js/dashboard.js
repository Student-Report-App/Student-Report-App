const nameElement = document.getElementById("name");
const roll = document.getElementById("roll");
const firstName = document.getElementById("first-name");
const branch = document.getElementById("branch");
const currentDate = document.getElementById("current-date");
const logoutBtn = document.getElementById("logout");
const classes = Array.from(document.querySelectorAll(".class-item"));
const hoverBox = document.getElementById("hover-box");

logoutBtn.addEventListener("click", () => {
  fetch("/auth/logout", {
    method: "POST",
  }).then(() => (location.href = "/"));
});

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

fetch("/api/userdata")
  .then((response) => response.json())
  .then((data) => {
    nameElement.textContent = data.name;
    roll.textContent = data.roll;
    firstName.textContent = data.name.split(" ")[0];
    branch.textContent = data.branch;
  });

currentDate.textContent = new Date().toDateString();

const today = days[new Date().getDay()];
const classItems = Array.from(document.querySelectorAll(".class-item"));

let subjectData = {};

fetch(`/api/timetable/CSE/${today}`)
  .then((response) => response.json())
  .then((data) => {
    classItems.forEach((item, index) => {
      const subject = data[index];
      if (subject && subject !== null) {
        item.textContent = subject;
        subjectData[subject] = null;
      } else {
        item.textContent = "Free";
        item.style.backgroundColor = "#16E838";
      }
    });

    const subjectPromises = Object.keys(subjectData).map((subject) =>
      fetch(`/api/subject/${branch.textContent}/${subject}`)
        .then((response) => response.json())
        .then((data) => {
          subjectData[subject] = data;
        })
    );

    Promise.all(subjectPromises).then(() => {
      classes.forEach((item) => {
        item.addEventListener("mouseover", (event) => {
          hoverBox.style.display = "block";
          hoverBox.style.top = `${
            event.target.offsetTop + event.target.offsetHeight + 20
          }px`;
          hoverBox.style.left = `${
            event.target.offsetLeft +
            event.target.offsetWidth / 2 -
            hoverBox.offsetWidth / 2
          }px`;

          const subject = event.target.innerText;
          if (subject !== "Free" && subjectData[subject]) {
            const data = subjectData[subject];
            hoverBox.innerHTML = `
              <strong>${data.title}</strong> <br>
              Credits: <strong>${data.credit}</strong> <br>
              ${data.lecturer} <br>
              Code: <strong>${data.code}</strong>
            `;
          } else {
            hoverBox.innerHTML = "This class is free. Enjoy!";
          }

          hoverBox.style.left = `${
            event.target.offsetLeft +
            event.target.offsetWidth / 2 -
            hoverBox.offsetWidth / 2
          }px`;
        });

        item.addEventListener("mouseout", () => {
          hoverBox.style.display = "none";
          hoverBox.innerHTML = "";
        });
      });
    });

    const hour = new Date().getHours();
    const timeSlots = [9, 10, 11, 12, 14, 15, 16, 17];
    const timeSlot = timeSlots.findIndex(slot => hour >= slot && hour < slot + 1) + 1 || null;

    const currentClass = document.getElementById(timeSlot);

    if (currentClass && currentClass.innerText !== "Free") {
      currentClass.style.color = "#fff";
      currentClass.style.backgroundColor = "#2c3e50";
    }
  });
