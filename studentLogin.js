document.addEventListener("DOMContentLoaded", function () {
    // Add event listener to the form submit event
    document.getElementById("loginForm").addEventListener("submit", function (event) {
        // Prevent default form submission behavior
        event.preventDefault();

        // Gather the username and password values
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        console.log("User name:" + username);
        console.log("password:" + password);

        // Define the JSON payload
        const data = {
            studentUserName: username,
            studentPassword: password
        };

        // Make an HTTP POST request to the API endpoint
        fetch('http://18.191.142.207:8080/student/login', {
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
                const studentId = Number(data);
                console.log('Student Id:', studentId);
                // Store the studentId
                localStorage.setItem('studentId', studentId);
                // Redirect to another page or perform further actions
                window.location.href = "studentHome.html";
            } else if (data === "User Password was Wrong") {
                alert("User password was wrong. Please try again.");
            } else if (data.startsWith("User Not Found with")) {
                alert(data);
            } else {
                alert("An unexpected error occurred. Please try again later.");
            }
        })
        .catch(error => {
            console.error('There was a problem with your fetch operation:', error);
            alert(error.message || "An error occurred while processing your request. Please try again later.");
        });
    });

    document.getElementById("signupButton").addEventListener("click", function () {
        window.location.href = "signup.html";
    });
});