document.addEventListener("DOMContentLoaded", function () {
    const studentId = localStorage.getItem('studentId');

    if (!studentId) {
        alert('Student ID not found. Please log in again.');
        window.location.href = "studentLogin.html"; // Redirect to login page if studentId is not found
        return;
    }

     // Logout button event listener
     document.getElementById('logoutButton').addEventListener('click', function () {
        localStorage.removeItem('studentId');
        window.location.href = "studentLogin.html";
    });


    // Fetch quiz summary
    fetch(`http://localhost:8084/result/quizSummary/${studentId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch quiz summary');
            }
            return response.json();
        })
        .then(data => {
            document.getElementById('noOfQuizzesPlayed').textContent = data.noOfQuizzesPlayed;
            document.getElementById('totalMarks').textContent = data.totalMarks;
            document.getElementById('scoredMarks').textContent = data.scoredMarks;
        })
        .catch(error => {
            console.error('Error fetching quiz summary:', error);
            alert('Failed to fetch quiz summary.');
        });

    // Fetch active quizzes
    fetch(`http://localhost:8083/quiz/activeQuizzes`)
        .then(response => response.json())
        .then(data => {
            const openQuizzesForm = document.getElementById('openQuizzesForm');
            const playButton = document.getElementById('playButton');
            const noQuizzesMessage = document.getElementById('noQuizzesMessage');

            if (data.length === 0) {
                noQuizzesMessage.style.display = 'block';
            } else {
                playButton.style.display = 'block';
                data.forEach(quiz => {
                    const quizElement = document.createElement('div');
                    quizElement.className = 'quizOption';
                    quizElement.innerHTML = `
                        <input type="radio" name="quiz" value="${quiz.quizId}" id="quiz${quiz.quizId}">
                        <label for="quiz${quiz.quizId}">${quiz.quizTitle}</label>
                    `;
                    openQuizzesForm.appendChild(quizElement);
                });
            }
        })
        .catch(error => {
            console.error('Error fetching active quizzes:', error);
            alert('Failed to fetch active quizzes.');
        });
    // Play button event listener
    document.getElementById('playButton').addEventListener('click', function () {
        const selectedQuiz = document.querySelector('input[name="quiz"]:checked');
        if (!selectedQuiz) {
            alert('Please select a quiz to play.');
            return;
        }
        const quizId = selectedQuiz.value;
        window.location.href = `playingQuiz.html?quizId=${quizId}`;
    });
});