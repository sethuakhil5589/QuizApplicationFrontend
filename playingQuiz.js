
document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const quizId = urlParams.get('quizId');
    const studentId = localStorage.getItem('studentId');
    
    if (!studentId) {
        alert('Student ID not found. Please log in again.');
        window.location.href = "studentLogin.html"; // Redirect to login page if studentId is not found
        return;
    }
    
    if (!quizId) {
        alert('Quiz ID not found.');
        window.location.href = "studentHome.html"; // Redirect to home page if quizId is not found
        return;
    }

    // Fetch question IDs for the quiz
    fetch(`http://18.222.200.25:8083/quiz/getQuiz/${quizId}`)
        .then(response => response.json())
        .then(questionIds => {
            // Fetch questions based on the question IDs
            return fetch(`http://18.222.200.25:8083/quiz/questionsByIds`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(questionIds)
            });
        })
        .then(response => response.json())
        .then(questions => {
            const quizContainer = document.getElementById('quizContainer');
            questions.forEach((question, index) => {
                const questionBox = document.createElement('div');
                questionBox.className = 'questionBox';
                questionBox.innerHTML = `
                    <div class="questionTitle" data-question-id="${question.questionId}">${index + 1}. ${question.question}</div>
                    <div class="options">
                        <label><input type="radio" name="question${question.questionId}" value="${question.option1}"> ${question.option1}</label>
                        <label><input type="radio" name="question${question.questionId}" value="${question.option2}"> ${question.option2}</label>
                        <label><input type="radio" name="question${question.questionId}" value="${question.option3}"> ${question.option3}</label>
                        <label><input type="radio" name="question${question.questionId}" value="${question.option4}"> ${question.option4}</label>
                    </div>
                `;
                quizContainer.appendChild(questionBox);
            });
        })
        .catch(error => {
            console.error('Error fetching questions:', error);
            alert('Failed to fetch questions.');
        });

    // Handle form submission
    document.getElementById('submitButton').addEventListener('click', function () {
        const answers = [];
        document.querySelectorAll('.questionBox').forEach(questionBox => {
            const questionId = questionBox.querySelector('.questionTitle').getAttribute('data-question-id');
            const selectedOption = questionBox.querySelector('input[type="radio"]:checked');
            if (selectedOption) {
                answers.push({
                    id: parseInt(questionId),
                    answer: selectedOption.value
                });
            }
        });

        if (answers.length < document.querySelectorAll('.questionBox').length) {
            alert('Please answer all questions.');
            return;
        }

        const submitData = {
            studentId: parseInt(studentId),
            quizId: parseInt(quizId),
            noOfQuestions: answers.length,
            answers: answers
        };

        fetch(`http://18.217.230.136:8084/result/submit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(submitData)
        })
        .then(response => response.text())
        .then(resultMessage => {
            alert(resultMessage);
            window.location.href = "studentHome.html"; // Redirect to home page after submission
        })
        .catch(error => {
            console.error('Error submitting quiz:', error);
            alert('Failed to submit quiz.');
        });
    });
});