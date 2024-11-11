const changePasswordBtn = document.getElementById("change-password-btn");
const originalPassword = document.getElementById("original-password");
const newPassword = document.getElementById("new-password");
const message = document.getElementById("message");

changePasswordBtn.addEventListener("click", () => {
  fetch("/auth/changePassword", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      oldPassword: originalPassword.value,
      newPassword: newPassword.value,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        message.style.color = "green";
        message.textContent = "Password changed successfully";
      } else {
        message.style.color = "red";
        message.textContent = "Incorrect password";
      }
    });
});
