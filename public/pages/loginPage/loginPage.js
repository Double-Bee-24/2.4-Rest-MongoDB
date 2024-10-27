const API_BASE_URL = "http://localhost:3005/api/v2/router";

document
  .getElementById("login-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent form submission
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const messageElement = document.getElementById("message");

    // Clear previous messages
    messageElement.textContent = "";

    // Validation
    if (!validateEmail(email)) {
      messageElement.textContent = "Invalid email format!";
      messageElement.style.color = "red";
      return;
    }

    if (password === "") {
      messageElement.textContent = "Please enter your password!";
      messageElement.style.color = "red";
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}?action=login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        window.location.href = "../../index.html"; // Redirect to the main page after successful login
      } else {
        const errorMessage = await response.text();
        messageElement.textContent = errorMessage;
        messageElement.style.color = "red";
      }
    } catch (error) {
      console.error("Error attempting to login:", error);
      messageElement.textContent = "An error occurred. Please try again.";
      messageElement.style.color = "red";
    }
  });

function validateEmail(email) {
  // Simple email format validation
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}
