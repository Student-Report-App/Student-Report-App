document.addEventListener("DOMContentLoaded", () => {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const subjectData = {};
  let branch;
  fetch("/api/userdata")
    .then((response) => response.json())
    .then((data) => {
      branch = data.branch;
      division = data.division;
      return fetch(`/api/timetable/branch/${branch}`);
    })
    .then((response) => response.json())
    .then((data) => {
      days.forEach((day) => {
        const branchSubjects = data[day];
        dayRow = document.getElementById(`${day}-row`);

        if (dayRow) {
          const subjectCells = dayRow.querySelectorAll(".subject");
          const lunchCell = dayRow.querySelectorAll(".lunch")[0];

          if (lunchCell) {
            lunchCell.textContent = "Lunch";
          }

          branchSubjects.forEach((subject) => {
            try {
              const [index, subjectName] = subject.split(" ");
              subjectCells[index].textContent = subjectName;
              fetch(`/api/subject/${subjectName}`)
                .then((response) => response.json())
                .then((subjectDetails) => {
                  subjectData[subjectName] = subjectDetails;
                });
            } catch (error) {}
          });
          fetch(`/api/timetable/division/${division}`)
            .then((response) => response.json())
            .then((data) => {
              const divSubjects = data[day];
              divSubjects.forEach((subject) => {
                try {
                  const [index, subjectName] = subject.split(" ");
                  subjectCells[index].textContent = subjectName;
                  fetch(`/api/subject/${subjectName}`)
                    .then((response) => response.json())
                    .then((subjectDetails) => {
                      subjectData[subjectName] = subjectDetails;
                    });
                } catch (error) {}
              });
            })
            .then(() => {
              subjectCells.forEach((cell) => {
                if (cell.textContent === "") {
                  cell.textContent = "Free";
                  cell.style.backgroundColor = "#16E838";
                }
              });
            });
        }
      });
    })
    .catch((error) => {});
  const hoverBox = document.getElementById("hover-box");
  document.querySelectorAll(".subject").forEach((cell) => {
    cell.addEventListener("mouseover", (event) => {
      const subject = event.target.innerText;
      if (subject !== "Free") {
        const data = subjectData[subject];
        hoverBox.innerHTML = `
              <strong>${data.title}</strong> <br>
              Credits: <strong>${data.credit}</strong> <br>
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
});
