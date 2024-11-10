document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("profile-form");
  const messageDiv = document.getElementById("message");

  async function fetchUserData() {
    try {
      const response = await fetch("/api/userdata");
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }

  let originalUsername = "";
  let originalEmail = "";
  function populateForm(data) {
    document.getElementById("username").value = data.username;
    document.getElementById("name").value = data.name;
    document.getElementById("email").value = data.email;
    document.getElementById("roll").value = data.roll;
    document.querySelector(
      `input[name="branch"][value="${data.branch}"]`
    ).checked = true;
    document.querySelector(
      `input[name="year"][value="${data.year}"]`
    ).checked = true;
    document.querySelector(
      `input[name="division"][value="${data.division}"]`
    ).checked = true;
    originalUsername = data.username;
    originalEmail = data.email;
  }

  fetchUserData().then((data) => {
    if (data) {
      populateForm(data);
    }
  });

  async function checkAvailability(endpoint, value) {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(value),
    });
    const data = await response.json();
    return data.exists;
  }

  async function handleFormSubmit(e) {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const roll = document.getElementById("roll").value;
    const division = document.querySelector(
      `input[name="division"]:checked`
    ).value;
    const branch = document.querySelector(`input[name="branch"]:checked`).value;
    const year = document.querySelector(`input[name="year"]:checked`).value;

    let usernameExists = false;
    let emailExists = false;

    if (username !== originalUsername) {
      usernameExists = await checkAvailability("/auth/checkUsername", {
        username,
      });
      if (usernameExists) {
        messageDiv.textContent = "Username already exists";
        messageDiv.style.color = "red";
        return;
      }
    }

    if (email !== originalEmail) {
      emailExists = await checkAvailability("/auth/checkEmail", { email });
      if (emailExists) {
        messageDiv.textContent = "Email already exists";
        messageDiv.style.color = "red";
        return;
      }
    }

    if (!usernameExists && !emailExists) {
      const response = await fetch("/auth/updateData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          username,
          email,
          roll,
          division,
          branch,
          year,
        }),
      });
      const data = await response.json();
      if (data.success) {
        messageDiv.textContent = "Profile updated successfully";
        messageDiv.style.color = "green";
      } else {
        messageDiv.textContent = "Error updating profile";
        messageDiv.style.color = "red";
      }
    }
  }

  form.addEventListener("submit", handleFormSubmit);
});
