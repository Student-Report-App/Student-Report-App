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
    })
    .catch((error) => {
      console.error("Error fetching timetable data:", error);
    });
});
