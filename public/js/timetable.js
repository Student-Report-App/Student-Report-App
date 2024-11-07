document.addEventListener("DOMContentLoaded", () => {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

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
          if (event.target.innerText !== "Free") {
            fetch(`/api/subject/CSE/${event.target.innerText}`)
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
          hoverBox.style.display = "block";
          hoverBox.style.left = `${event.pageX + 10}px`;
          hoverBox.style.top = `${event.pageY + 10}px`;
        });
        cell.addEventListener("mouseout", () => {
          hoverBox.style.display = "none";
        });
      });

      document.querySelectorAll(".subject").forEach((cell) => {
        cell.addEventListener("mouseover", (event) => {
          hoverBox.style.display = "block";
          hoverBox.style.left = `${event.pageX + 10}px`;
          hoverBox.style.top = `${event.pageY + 10}px`;
          hoverBox.textContent = cell.textContent;
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
