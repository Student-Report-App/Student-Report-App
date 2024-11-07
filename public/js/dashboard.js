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
              ${data.title} <br>
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

    let timeSlot;
    switch (true) {
      case 9 <= hour && hour < 10:
        timeSlot = 1;
        break;
      case 10 <= hour && hour < 11:
        timeSlot = 2;
        break;
      case 11 <= hour && hour < 12:
        timeSlot = 3;
        break;
      case 12 <= hour && hour < 13:
        timeSlot = 4;
        break;
      case 14 <= hour && hour < 15:
        timeSlot = 5;
        break;
      case 15 <= hour && hour < 16:
        timeSlot = 6;
        break;
      case 16 <= hour && hour < 17:
        timeSlot = 7;
        break;
      case 17 <= hour && hour < 18:
        timeSlot = 8;
        break;
      default:
        timeSlot = null;
        break;
    }

    let currentClass;
    switch (timeSlot) {
      case 1:
        currentClass = document.getElementById("1");
        break;
      case 2:
        currentClass = document.getElementById("2");
        break;
      case 3:
        currentClass = document.getElementById("3");
        break;
      case 4:
        currentClass = document.getElementById("4");
        break;
      case 5:
        currentClass = document.getElementById("5");
        break;
      case 6:
        currentClass = document.getElementById("6");
        break;
      case 7:
        currentClass = document.getElementById("7");
        break;
      case 8:
        currentClass = document.getElementById("8");
        break;
      default:
        currentClass = null;
        break;
    }

    if (currentClass && currentClass.innerText !== "Free") {
      currentClass.style.color = "#fff";
      currentClass.style.backgroundColor = "#2c3e50";
    }

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

        if (event.target.innerText !== "Free") {
          fetch(`/api/subject/${branch.textContent}/${event.target.innerText}`)
            .then((response) => response.json())
            .then((data) => {
              hoverBox.innerHTML = `
                ${data.title} <br>
                Credits: <strong>${data.credit}</strong> <br>
                ${data.lecturer} <br>
                Code: <strong>${data.code}</strong>
              `;
              hoverBox.style.left = `${
                event.target.offsetLeft +
                event.target.offsetWidth / 2 -
                hoverBox.offsetWidth / 2
              }px`;
            });
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
