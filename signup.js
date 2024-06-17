document.addEventListener("DOMContentLoaded", function() {
    // Add event listener to the form submit event
    document.getElementById("signupForm").addEventListener("submit", function(event) {
        // Prevent default form submission behavior
        event.preventDefault();
        
        // Gather the username, password, and email values
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        const name = document.getElementById("name").value;
        console.log("Username:", username);
        console.log("Password:", password);
        console.log("Email:", name);

        // Define the JSON payload
        const data = {
            studentUserName: username,
            studentPassword: password,
            studentName: name
        };

        // Make an HTTP POST request to the API endpoint for signup
        fetch('http://localhost:8080/student/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text(); // Return response text
        })
        .then(data => {
            console.log('Signup response:', data);
            window.location.href=studentLogin.html
            alert(data); // Show response message
        })
        .catch(error => {
            console.error('There was a problem with your fetch operation:', error);
        });
    });
});