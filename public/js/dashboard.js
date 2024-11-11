const nameElement = document.getElementById("name");
const roll = document.getElementById("roll");
const firstName = document.getElementById("first-name");
const branchElement = document.getElementById("branch");
const currentDate = document.getElementById("current-date");
const logoutBtn = document.getElementById("logout");
const classes = Array.from(document.querySelectorAll(".class-item"));
const hoverBox = document.getElementById("hover-box");
const courseList = document.getElementById("course-list");

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
let subjectData = {};
let branch = "";
let division = "";

logoutBtn.addEventListener("click", handleLogout);

function handleLogout() {
  fetch("/auth/logout", { method: "POST" }).then(() => (location.href = "/"));
}

function fetchUserData() {
  return fetch("/api/userdata")
    .then((response) => response.json())
    .then((data) => {
      nameElement.textContent = data.name;
      roll.textContent = data.roll;
      firstName.textContent = data.name.split(" ")[0];
      branchElement.textContent = data.branch;
      branch = data.branch;
      division = data.division;
    });
}

function fetchTimetable() {
  const today = days[new Date().getDay()];
  fetchUserData()
    .then(() => fetch(`/api/timetable/branch/${branch}/${today}`))
    .then((response) => response.json())
    .then((branchData) => updateClassItems(branchData))
    .then(() => fetch(`/api/timetable/division/${division}/${today}`))
    .then((response) => response.json())
    .then((divisionData) => updateClassItems(divisionData))
    .then(() => {
      classes.forEach((cell) => {
        if (cell.textContent === "") {
          cell.textContent = "Free";
          cell.style.backgroundColor = "#16E838";
        }
      });
    })
    .then(() => highlightCurrentClass());
}

function updateClassItems(data) {
  data.forEach((subject) => {
    try {
      let [index, subjectName] = subject.split(" ");
      index = index >= 4 ? Number(index) + 1 : index;
      classes[index].textContent = subjectName;
      fetch(`/api/subject/${subjectName}`)
        .then((response) => response.json())
        .then((subjectDetails) => {
          subjectData[subjectName] = subjectDetails;
        });
    } catch (error) {}
  });
}

classes.forEach((item) => {
  item.addEventListener("mouseover", handleMouseOver);
  item.addEventListener("mouseout", handleMouseOut);
});

function handleMouseOver(event) {
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
  if (subjectData[subject]) {
    const data = subjectData[subject];
    hoverBox.innerHTML = `
      <strong>${data.title}</strong> <br>
      Credits: <strong>${data.credit}</strong> <br>
      Lecturer: <strong>${data[branch] || data[division]}</strong> <br>
      Code: <strong>${data.code}</strong>
    `;
  } else if (subject === "Lunch") {
    hoverBox.innerHTML = "<strong>Bon appetit!</strong>";
  } else {
    hoverBox.innerHTML = "This class is free!<br><strong>Enjoy!</strong>";
  }

  hoverBox.style.left = `${
    event.target.offsetLeft +
    event.target.offsetWidth / 2 -
    hoverBox.offsetWidth / 2
  }px`;
}

function handleMouseOut() {
  hoverBox.style.display = "none";
  hoverBox.innerHTML = "";
}

function highlightCurrentClass() {
  const hour = new Date().getHours();
  const timeSlots = [9, 10, 11, 12, 14, 15, 16, 17];
  const timeSlot =
    timeSlots.findIndex((slot) => hour >= slot && hour < slot + 1) + 1 || null;

  const minutesLeft = 60 - new Date().getMinutes();
  const nextClass = document.getElementById("next-class");

  try {
    let currentClass;
    if (hour === 13) {
      currentClass = document.getElementById("lunch-box");
    } else {
      currentClass = document.getElementById(timeSlot);
    }
    currentClass.style.color = "#fff";
    currentClass.style.backgroundColor = "#2c3e50";

    let nextClassName = "";
    if (hour === 13) {
      nextClassName = document.getElementById(5).textContent;
    } else if (timeSlot === 4) {
      nextClassName = "Lunch";
    } else if (timeSlot === 8) {
      nextClassName = "End of the day";
    } else {
      nextClassName = document.getElementById(timeSlot + 1).textContent;
    }

    nextClass.innerHTML = `<strong>${nextClassName}</strong> in <strong>${minutesLeft} minutes</strong>`;
  } catch (error) {
    nextClass.innerHTML = `Nothing Yet`;
  }
}

function generateCalendar() {
  const calendarElement = document.getElementById("calendar");
  const today = new Date();
  const month = today.getMonth();
  const year = today.getFullYear();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  let calendarHTML = "<table><tr>";
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  daysOfWeek.forEach((day) => {
    calendarHTML += `<th>${day}</th>`;
  });
  calendarHTML += "</tr><tr>";

  for (let i = 0; i < firstDay; i++) {
    calendarHTML += "<td></td>";
  }

  for (let day = 1; day <= daysInMonth; day++) {
    if ((firstDay + day - 1) % 7 === 0) {
      calendarHTML += "</tr><tr>";
    }
    if (day === today.getDate()) {
      calendarHTML += `<td class="highlight">${day}</td>`;
    } else {
      calendarHTML += `<td>${day}</td>`;
    }
  }

  calendarHTML += "</tr></table>";
  calendarElement.innerHTML = calendarHTML;
}

function fillCoursesList() {
  fetch("/api/subjects")
    .then((response) => response.json())
    .then((data) => {
      for (const [key, value] of Object.entries(data[0])) {
        if (!value.title) continue;
        const subjectTitleAndCode = document.createElement("h4");
        subjectTitleAndCode.textContent = `${value.title} (${value.code})`;
        courseList.appendChild(subjectTitleAndCode);

        const subjectCredit = document.createElement("p");
        subjectCredit.textContent = `Credits: ${value.credit}`;
        courseList.appendChild(subjectCredit);

        const subjectLecturer = document.createElement("p");
        subjectLecturer.textContent = `Lecturer: ${
          value[branch] || value[division]
        }`;
        courseList.appendChild(subjectLecturer);
      }
    });
}
function init() {
  currentDate.textContent = new Date().toDateString();
  fetchTimetable();
  generateCalendar();
  fillCoursesList();
}

init();
