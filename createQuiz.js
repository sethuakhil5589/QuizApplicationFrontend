document.addEventListener("DOMContentLoaded", function() {
    // const adminId = new URLSearchParams(window.location.search).get('adminId');
    const adminId = localStorage.getItem('adminId');
    if (!adminId) {
        alert('Admin ID not found. Please log in again.');
        window.location.href = "adminLogin.html"; // Redirect to login page if adminId is not found
        return;
    }


    // Fetch all questions
    fetch('http://18.222.200.25:8083/quiz/allQuestions')
        .then(response => response.json())
        .then(data => {
            const questionList = document.getElementById('questionList');
            data.forEach(question => {
                const questionElement = document.createElement('div');
                questionElement.className = 'questionItem';
                questionElement.innerHTML = `
                    <input type="checkbox" id="question${question.questionId}" value="${question.questionId}">
                    <label for="question${question.questionId}">${question.question}</label><br>
                `;
                questionList.appendChild(questionElement);
            });
        })
        .catch(error => {
            console.error('Error fetching questions:', error);
            alert('Failed to fetch questions.');
        });

    document.getElementById("quizForm").addEventListener("submit", function(event) {
        event.preventDefault();
        const quizTitle = document.getElementById("quizTitle").value;
        const selectedQuestions = Array.from(document.querySelectorAll('input[type="checkbox"]:checked')).map(input => parseInt(input.value));
        const data = {
            questionIds: selectedQuestions,
            adminId: parseInt(adminId),
            title: quizTitle
        };
        fetch('http://18.222.200.25:8083/quiz/create', {
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
            return response.text(); // Return plain text
        })
        .then(data => {
            // Check if the response contains the success message
            if (data.includes('Quiz saved')) {
                alert('Quiz created successfully.');
                // Redirect to admin home page
                window.location.href = "adminHome.html";
            } else {
                throw new Error('Unexpected response from server');
            }
        })
        .catch(error => {
            console.error('Error creating quiz:', error);
            alert('Failed to create quiz.');
        });
    });
});