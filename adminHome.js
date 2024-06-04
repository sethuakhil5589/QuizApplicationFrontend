document.addEventListener("DOMContentLoaded", function () {
    const adminId = localStorage.getItem('adminId');
    if (!adminId) {
        alert('No admin ID found. Please log in.');
        window.location.href = "adminLogin.html";
        return;
    }
    document.getElementById('adminIdDisplay').textContent = adminId;

    // Logout button event listener
    document.getElementById('logoutButton').addEventListener('click', function () {
        localStorage.removeItem('adminId');
        window.location.href = "adminLogin.html";
    });

    // Fetch quiz titles
    fetch(`http://18.116.63.41:8083/quiz/titles/${adminId}`)
        .then(response => response.json())
        .then(data => {
            const quizzesContainer = document.getElementById('quizzesContainer');
            data.forEach(quiz => {
                const quizElement = document.createElement('div');
                quizElement.className = 'quizTile';
                quizElement.innerHTML = `
                    <h2>${quiz.quizTitle}</h2>
                    <button class="updateButton" data-quiz-id="${quiz.quizId}">Update</button>
                    <button class="deleteButton" data-quiz-id="${quiz.quizId}">Delete</button>
                    <button class="toggleButton" data-quiz-id="${quiz.quizId}">${quiz.status ? 'Stop Quiz' : 'Start Quiz'}</button>
                `;
                quizzesContainer.appendChild(quizElement);
            });

            // Add event listeners for update, delete, and toggle buttons
            document.querySelectorAll('.updateButton').forEach(button => {
                button.addEventListener('click', function() {
                    const quizId = this.getAttribute('data-quiz-id');
                    window.location.href = `updateQuiz.html?quizId=${quizId}`;
                });
            });

            document.querySelectorAll('.deleteButton').forEach(button => {
                button.addEventListener('click', function () {
                    const quizId = this.getAttribute('data-quiz-id');
                    fetch(`http://18.116.63.41:8083/quiz/deleteQuiz/${quizId}`, { method: 'DELETE' })
                        .then(response => {
                            if (response.ok) {
                                alert('Quiz deleted successfully.');
                                location.reload(); // Reload the page to refresh the quiz list
                            } else {
                                alert('Failed to delete quiz.');
                            }
                        });
                });
            });

            document.querySelectorAll('.toggleButton').forEach(button => {
                button.addEventListener('click', function () {
                    const quizId = this.getAttribute('data-quiz-id');
                    const newStatus = this.textContent === 'Start Quiz';
                    fetch(`http://18.116.63.41:8083/quiz/status/${quizId}/${newStatus}`, { method: 'GET' })
                        .then(response => response.text())
                        .then(result => {
                            if (result.includes('Status changed to:')) {
                                alert(`Quiz ${newStatus ? 'started' : 'stopped'} successfully.`);
                                this.textContent = newStatus ? 'Stop Quiz' : 'Start Quiz';
                            } else {
                                alert(`Failed to ${newStatus ? 'start' : 'stop'} quiz.`);
                            }
                        })
                        .catch(error => {
                            console.error('Error changing quiz status:', error);
                            alert('Failed to change quiz status.');
                        });
                });
            });
        })
        .catch(error => {
            console.error('Error fetching quizzes:', error);
            alert('Failed to fetch quizzes.');
        });

    document.getElementById("createQuizButton").addEventListener("click", function () {
        window.location.href = "createQuiz.html";
    });

    document.getElementById("createQuestionButton").addEventListener("click", function () {
        window.location.href = "createQuestion.html";
    });

    document.getElementById("updateOrDeleteQuestionButton").addEventListener("click", function () {
        window.location.href = "updateOrDeleteQuestion.html";
    });
});