const changePasswordBtn = document.getElementById("change-password-btn");
const currentPassword = document.getElementById("current-password");
const newPassword = document.getElementById("new-password");
const confirmPassword = document.getElementById("confirm-password");
const currentPasswordError = document.getElementById("current-password-error");
const newPasswordError = document.getElementById("new-password-error");
const confirmPasswordError = document.getElementById("confirm-password-error");
const message = document.getElementById("message");

function validatePasswords() {
  let isValid = true;
  if (!currentPassword.value) {
    currentPasswordError.textContent = "Please enter your current password";
    isValid = false;
  } else {
    currentPasswordError.textContent = "";
  }
  if (!newPassword.value) {
    newPasswordError.textContent = "Please enter your new password";
    isValid = false;
  } else {
    newPasswordError.textContent = "";
  }
  if (!confirmPassword.value) {
    confirmPasswordError.textContent = "Please confirm your new password";
    isValid = false;
  } else {
    confirmPasswordError.textContent = "";
  }
  if (newPassword.value && newPassword.value === currentPassword.value) {
    newPasswordError.textContent =
      "New password cannot be same as current password";
    isValid = false;
  }
  if (
    newPassword.value &&
    confirmPassword.value &&
    newPassword.value !== confirmPassword.value
  ) {
    confirmPasswordError.textContent = "Passwords do not match";
    isValid = false;
  }
  return isValid;
}

function changePassword() {
  fetch("/auth/changePassword", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      oldPassword: currentPassword.value,
      newPassword: newPassword.value,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        message.style.color = "green";
        const redirectToDashboard = () => {
          let countdown = 3;
          message.textContent = `Password changed successfully. Redirecting to dashboard in ${countdown--}`;
          const countdownInterval = setInterval(() => {
            if (countdown > 0) {
              message.textContent = `Password changed successfully. Redirecting to dashboard in ${countdown--}`;
            } else {
              clearInterval(countdownInterval);
              window.location.href = "/dashboard";
            }
          }, 1000);
        };
        redirectToDashboard();
      } else {
        currentPasswordError.style.color = "red";
        currentPasswordError.textContent = "Incorrect password";
      }
    });
}

changePasswordBtn.addEventListener("click", () => {
  if (validatePasswords()) {
    changePassword();
  }
});
