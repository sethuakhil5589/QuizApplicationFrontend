document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("adminLoginForm").addEventListener("submit", function(event) {
        event.preventDefault();

        const adminUsername = document.getElementById("adminUsername").value;
        const adminPassword = document.getElementById("adminPassword").value;

        const data = {
            adminUserName: adminUsername,
            adminPassword: adminPassword
        };

        fetch('http://18.118.208.245:8080/admin/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (response.status === 401) {
                throw new Error('Unauthorized: Incorrect password');
            }
            if (response.status === 404) {
                throw new Error('Unauthorized: Incorrect username');
            }
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            console.log('Login response:', data);
            if (!isNaN(data) && Number(data) > 0) {
                const adminId = Number(data);
                console.log('Admin ID:', adminId);
                // Admin login successful
                localStorage.setItem('adminId', adminId);
                // Redirect to another page or perform further actions
                window.location.href = "adminHome.html";
            } else if (data === "User Password was Wrong") {
                // Password was wrong
                alert("User password was wrong. Please try again.");
            } else if (data.startsWith("User Not Found with")) {
                // User not found
                alert(data);
            } else {
                // Unexpected error
                alert("An unexpected error occurred. Please try again later.");
            }
        })
        .catch(error => {
            console.error('There was a problem with your fetch operation:', error);
            // Display a generic error message or handle the error as needed
            alert(error.message || "An error occurred while processing your request. Please try again later.");
        });
    });
});