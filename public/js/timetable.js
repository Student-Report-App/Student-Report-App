document.addEventListener("DOMContentLoaded", () => {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const subjectData = {};

  fetch("/api/timetable/CSE")
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      days.forEach((day) => {
        const subjects = data[day];

        const dayRow = Array.from(document.querySelectorAll("tr")).find(
          (row) => {
            const dayCell = row.querySelector(".day");
            return dayCell && dayCell.textContent === day;
          }
        );

        if (dayRow) {
          const subjectCells = dayRow.querySelectorAll(".subject");
          const lunchCell = dayRow.querySelectorAll(".lunch")[0];

          subjectCells.forEach((cell, index) => {
            const subject = subjects[index];
            if (subject && subject !== null) {
              cell.textContent = subject;
              fetch(`/api/subject/CSE/${subject}`)
                .then((response) => response.json())
                .then((subjectDetails) => {
                  subjectData[subject] = subjectDetails;
                });
            } else {
              cell.textContent = "Free";
              cell.style.backgroundColor = "#16E838";
            }
          });

          if (lunchCell) {
            lunchCell.textContent = "Lunch";
          }
        }
      });

      const hoverBox = document.getElementById("hover-box");
      document.querySelectorAll(".subject").forEach((cell) => {
        cell.addEventListener("mouseover", (event) => {
          const subject = event.target.innerText;
          if (subject !== "Free") {
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
          hoverBox.style.display = "block";
          hoverBox.style.left = `${
            event.target.offsetLeft +
            event.target.offsetWidth / 2 -
            hoverBox.offsetWidth / 2
          }px`;
          hoverBox.style.top = `${
            event.target.offsetTop + event.target.offsetHeight + 10
          }px`;
        });
        cell.addEventListener("mouseout", () => {
          hoverBox.style.display = "none";
        });
      });
    })
    .catch((error) => {
      console.error("Error fetching timetable data:", error);
    });
});
