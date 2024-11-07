const API_BASE_URL = "http://localhost:3005/api/v2/router";

function validateEmail(email) {
  // Simple email format validation
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

// Register user and adds in to the user database
const createUser = async (credentials) => {
  try {
    const response = await fetch(`${API_BASE_URL}?action=register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "An error occurred");
    }

    return await response.json();
  } catch (error) {
    console.error("Error attempting to create new user", error);
    throw error;
  }
};

document
  .getElementById("register-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent form submission
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;
    const messageElement = document.getElementById("message");

    // Clear previous messages
    messageElement.textContent = "";

    // Validation
    if (password !== confirmPassword) {
      messageElement.textContent = "Passwords do not match!";
      messageElement.style.color = "red";
      return;
    }

    if (!validateEmail(email)) {
      messageElement.textContent = "Invalid email format!";
      messageElement.style.color = "red";
      return;
    }

    // Send credentials to server
    try {
      await createUser({ email, password });

      // Redirect to login page
      window.location.href = "../loginPage/loginPage.html";
    } catch (error) {
      messageElement.textContent = error.message;
      messageElement.style.color = "red";
    }
  });
