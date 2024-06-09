document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const quizId = urlParams.get('quizId');
    const adminId = localStorage.getItem('adminId');
    console.log("Quiz ID:", quizId);
    console.log("Admin ID:", adminId);

    if (!quizId || !adminId) {
        alert('Missing quiz ID or admin ID. Please try again.');
        window.location.href = "adminHome.html";
        return;
    }

    // Fetch existing quiz details
    fetch(`http://18.222.200.25:8083/quiz/quizDetails/${quizId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch quiz details');
            }
            return response.json();
        })
        .then(data => {
            console.log('Quiz details fetched successfully:', data);
            if (!data || !data.questionIds) {
                throw new Error('Invalid quiz data received');
            }

            document.getElementById('quizTitle').value = data.title;

            // Fetch all questions
            fetch('http://3.142.222.173:8082/questions/allQuestions')
                .then(response => response.json())
                .then(questions => {
                    const questionList = document.getElementById('questionList');
                    questions.forEach(question => {
                        const isChecked = data.questionIds.includes(question.questionId);
                        const questionElement = document.createElement('div');
                        questionElement.className = 'questionItem';
                        questionElement.innerHTML = `
                            <input type="checkbox" id="question${question.questionId}" value="${question.questionId}" ${isChecked ? 'checked' : ''}>
                            <label for="question${question.questionId}">${question.question}</label><br>
                        `;
                        questionList.appendChild(questionElement);
                    });
                })
                .catch(error => {
                    console.error('Error fetching questions:', error);
                    alert('Failed to fetch questions.');
                });

        })
        .catch(error => {
            console.error('Error fetching quiz details:', error);
            alert('Failed to fetch quiz details.');
        });

    document.getElementById("quizForm").addEventListener("submit", function (event) {
        event.preventDefault();
        const quizTitle = document.getElementById("quizTitle").value;
        const selectedQuestions = Array.from(document.querySelectorAll('input[type="checkbox"]:checked')).map(input => parseInt(input.value));
        const data = {
            quizId: parseInt(quizId),
            questionIds: selectedQuestions,
            adminId: parseInt(adminId),
            title: quizTitle
        };

        fetch('http://18.222.200.25:8083/quiz/updateQuiz', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to update quiz: ${response.statusText}`);
                }
                return response.text();
            })
            .then(data => {
                if (data.includes('Quiz updated with title:')) {
                    alert(data);
                    window.location.href = "adminHome.html";
                } else {
                    throw new Error('Unexpected response from server');
                }
            })
            .catch(error => {
                console.error('Error updating quiz:', error);
                alert('Failed to update quiz.');
            });
    });
});