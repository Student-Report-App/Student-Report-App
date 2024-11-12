document.addEventListener("DOMContentLoaded", () => {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  let subjectData = {};
  let branch, division;

  const allSubjectsFilled = new Promise((resolve) => {
    resolveAllSubjectsFilled = resolve;
  });

  const fetchSubjectDetails = async () => {
    try {
      const response = await fetch("/api/subjects");
      const data = await response.json();
      subjectData = data[0];
    } catch (error) {
      console.error("Error fetching subject details:", error);
    }
  };

  const updateSubjectCells = (subjects, dayCells) => {
    subjects.forEach((subject) => {
      if (subject) {
        const [index, subjectName] = subject.split(" ");
        dayCells[index].textContent = subjectName;
      }
    });
  };

  const fetchSubjects = async (type, value) => {
    try {
      const response = await fetch(`/api/timetable/${type}/${value}`);
      const data = await response.json();
      days.forEach((day) => {
        const dayCells = document.querySelectorAll(`.${day}`);
        const subjects = data[day];
        updateSubjectCells(subjects, dayCells);
      });
    } catch (error) {
      console.error(`Error fetching subjects for ${type} ${value}:`, error);
    }
    if (type === "division") {
      resolveAllSubjectsFilled();
    }
  };

  const fillLunchCells = () => {
    const lunchCells = document.querySelectorAll(".lunch");
    lunchCells.forEach((cell) => {
      cell.textContent = "Lunch";
    });
  };

  const fillEmptyCells = () => {
    const cells = document.querySelectorAll(".subject");
    cells.forEach((cell) => {
      if (cell.textContent === "") {
        cell.textContent = "Free";
        cell.style.backgroundColor = "#16E838";
      }
    });
  };

  const fetchUserData = async () => {
    try {
      const response = await fetch("/api/userdata");
      const data = await response.json();
      branch = data.branch;
      division = data.division;
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const initializeTimetable = async () => {
    await fetchUserData();
    fetchSubjects("branch", branch);
    fetchSubjects("division", division);
    fillLunchCells();
    allSubjectsFilled.then(() => fillEmptyCells());
    fetchSubjectDetails();
  };

  const setupHoverBox = () => {
    const hoverBox = document.getElementById("hover-box");
    document.querySelectorAll(".subject").forEach((cell) => {
      cell.addEventListener("mouseover", (event) => {
        const subject = event.target.innerText;
        if (subject === "Lunch") {
          hoverBox.innerHTML = "<strong>Bon appetit!</strong>";
        } else if (subject === "Free") {
          hoverBox.innerHTML = "This class is free!<br><strong>Enjoy!</strong>";
        } else {
          try {
            const data = subjectData[subject];
            hoverBox.innerHTML = `
              <strong>${data.title}</strong> <br>
              Credits: <strong>${data.credit}</strong> <br>
              Lecturer: <strong>${data[branch] || data[division]}</strong> <br>
              Code: <strong>${data.code}</strong>
            `;
          } catch (error) {}
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
  };

  initializeTimetable();
  setupHoverBox();
});
