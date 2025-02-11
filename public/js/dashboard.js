const nameElement = document.getElementById("name");
const roll = document.getElementById("roll");
const firstName = document.getElementById("first-name");
const branchElement = document.getElementById("branch");
const yearElement = document.getElementById("year");
const divisionElement = document.getElementById("division");
const currentDate = document.getElementById("current-date");
const logoutBtn = document.getElementById("logout");
const classes = Array.from(document.querySelectorAll(".class-item"));
const hoverBox = document.getElementById("hover-box");
const courseList = document.getElementById("course-list");
let secretKeyCorrect = false;

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

const fetchSubjectDetails = () => {
  fetch("/api/subjects")
    .then((response) => response.json())
    .then((data) => {
      for (const [key, value] of Object.entries(data[0])) {
        subjectData[key] = value;
      }
    })
    .catch((error) => {});
};
fetchSubjectDetails();

logoutBtn.addEventListener("click", handleLogout);

function handleLogout() {
  fetch("/auth/logout", { method: "POST" }).then(() => (location.href = "/"));
}

function fetchUserData() {
  return fetch("/api/userData")
    .then((response) => response.json())
    .then((data) => {
      nameElement.textContent = data.name;
      roll.textContent = data.roll;
      firstName.textContent = data.name.split(" ")[0];
      branchElement.textContent = data.branch;
      divisionElement.textContent = data.division;
      yearElement.textContent = data.year;
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
        subjectCredit.innerHTML = `Credits: <strong>${value.credit}</strong>`;
        courseList.appendChild(subjectCredit);

        const subjectLecturer = document.createElement("p");
        subjectLecturer.innerHTML = `Lecturer: <strong>${
          value[branch] || value[division]
        }<strong>`;
        courseList.appendChild(subjectLecturer);
      }
    });
}

function fillAnnouncementList() {
  fetch("/api/announcements")
    .then((response) => response.json())
    .then((data) => {
      const announcementList = document.getElementById("announcement-list");
      data.forEach((entry, index) => {
        const atTime = new Date(entry.at);
        const timeLeft = atTime - new Date();
        const timeLeftString = formatTimeLeft(timeLeft);
        const exactTime = formatExactTime(atTime);
        const fullInformation = `<strong>${entry.name}</strong> in <strong>${timeLeftString}</strong> (${exactTime})`;

        const announcementElement = document.createElement("p");
        timeLeftString.startsWith("0d")
          ? (announcementElement.style.color = "red")
          : null;
        announcementElement.innerHTML = fullInformation;
        if (index === 0) {
          const upcoming = document.getElementById("next-announcement");
          upcoming.innerHTML = fullInformation;
          timeLeftString.startsWith("0d")
            ? (upcoming.style.color = "red")
            : null;
        }
        announcementList.appendChild(announcementElement);

        announcementElement.addEventListener("mouseover", () => {
          markEventToCalendar(entry.name, atTime);
        });

        announcementElement.addEventListener("mouseout", () => {
          const calendarElement = document.getElementById("calendar");
          const days = calendarElement.getElementsByTagName("td");
          const dayToMark = atTime.getDate();

          for (let day of days) {
            if (day.textContent == dayToMark) {
              day.style.transition = "all 0.3s";
              day.style.backgroundColor = "";
              day.title = "";
              break;
            }
          }
        });

        const buttonContainer = document.createElement("div");
        buttonContainer.style.display = "flex";
        buttonContainer.style.justifyContent = "space-between";

        const addEventButton = document.createElement("button");
        addEventButton.classList.add("addEventButton");
        addEventButton.textContent = "Add to calendar";
        addEventButton.addEventListener("click", () => {
          addEventToCalendar(entry.name, atTime);
        });
        buttonContainer.appendChild(addEventButton);

        announcementList.appendChild(buttonContainer);
      });
    });
}

function markEventToCalendar(name, atDate) {
  const calendarElement = document.getElementById("calendar");
  const days = calendarElement.getElementsByTagName("td");
  const dayToMark = atDate.getDate();

  for (let day of days) {
    if (day.textContent == dayToMark) {
      day.style.transition = "all 0.3s";
      day.style.backgroundColor = "#16E838";
      day.title = name;
      break;
    }
  }
}

function addEventToCalendar(name, atTime) {
  const adjustedTime = new Date(atTime.getTime() + 5.5 * 60 * 60 * 1000);
  const event = {
    summary: encodeURIComponent(name),
    start: encodeURIComponent(
      adjustedTime.toISOString().replace(/[-:.Z]/g, ""),
    ),
    end: encodeURIComponent(
      new Date(adjustedTime.getTime() + 60 * 60 * 1000)
        .toISOString()
        .replace(/[-:.Z]/g, ""),
    ),
  };
  const url = `https://calendar.google.com/calendar/r/eventedit?&text=${event.summary}&dates=${event.start}/${event.end}`;
  window.open(url, "_blank");
}

function formatTimeLeft(timeLeft) {
  const daysLeft = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hoursLeft = Math.floor(
    (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  );
  const minutesLeft = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  return `${daysLeft}d ${hoursLeft}h ${minutesLeft}m`;
}

function formatExactTime(atTime) {
  return (
    atTime.toDateString().split(" ").slice(1, 3).join(" ") +
    " - " +
    atTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  );
}

document
  .getElementById("addButton")
  .addEventListener("click", handleAddButtonClick);
document.querySelector(".close-button").addEventListener("click", closeModal);
document
  .getElementById("submitSecretKey")
  .addEventListener("click", submitSecretKey);
document
  .getElementById("submitAnnouncement")
  .addEventListener("click", submitAnnouncement);

function handleAddButtonClick() {
  document.getElementById("secretKeyModal").style.display = "block";
}

function closeModal() {
  document.getElementById("secretKeyModal").style.display = "none";
}

function submitSecretKey() {
  const secretKey = document.getElementById("secretKeyInput").value;
  const secretKeyMessage = document.getElementById("secretKeyMessage");
  fetch("/api/secretKey", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ secretKey }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        secretKeyMessage.style.color = "green";
        secretKeyMessage.textContent =
          "Secret key is correct. Please fill the data below.";
        secretKeyCorrect = true;
      } else {
        secretKeyMessage.style.color = "red";
        secretKeyMessage.textContent =
          "Secret key is incorrect. Please try again.";
      }
    })
    .catch((error) => {
      console.error("Error submitting secret key:", error);
    });
}

function submitAnnouncementData(announcement, dueDate, checkedValues) {
  if (announcement && dueDate) {
    fetch("/api/announcements", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ announcement, dueDate, checkedValues }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          closeModal();
          window.location.reload();
        } else {
          announcementMessage.style.color = "red";
          announcementMessage.textContent =
            "Error submitting announcement. Please try again.";
          console.error("Error submitting announcement:", data.error);
        }
      })
      .catch((error) => {
        announcementMessage.style.color = "red";
        announcementMessage.textContent =
          "Error submitting announcement. Please try again.";
        console.error("Error submitting announcement:", error);
      });
  } else {
    announcementMessage.style.color = "red";
    announcementMessage.textContent =
      "Please write an announcement and enter a due date.";
  }
}

function submitAnnouncement() {
  const announcement = document.getElementById("announcementInput").value;
  const dueDate = document.getElementById("dueDateInput").value;
  const announcementChecks = document.querySelectorAll(".announcement-check");
  const announcementMessage = document.getElementById("announcementMessage");
  const checkedValues = Array.from(announcementChecks)
    .filter((check) => check.checked)
    .map((check) => check.value);
  if (secretKeyCorrect) {
    submitAnnouncementData(announcement, dueDate, checkedValues);
  } else {
    announcementMessage.style.color = "red";
    announcementMessage.textContent =
      "Please submit the correct secret key first.";
  }
}

function init() {
  currentDate.textContent = new Date().toDateString();
  fetchTimetable();
  fillAnnouncementList();
  generateCalendar();
  fillCoursesList();
}

init();
