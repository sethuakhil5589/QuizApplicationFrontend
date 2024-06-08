document.addEventListener("DOMContentLoaded", function () {
    // Fetch all questions
    fetch('http://3.22.77.81:8082/questions/allQuestions')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch questions');
            }
            return response.json();
        })
        .then(questions => {
            const questionList = document.getElementById('questionList');
            questions.forEach(question => {
                const questionElement = document.createElement('div');
                questionElement.className = 'questionItem';
                questionElement.innerHTML = `
                    <input type="radio" name="questionId" id="question${question.questionId}" value="${question.questionId}">
                    <label for="question${question.questionId}">${question.question}</label><br>
                `;
                questionList.appendChild(questionElement);
            });
        })
        .catch(error => {
            console.error('Error fetching questions:', error);
            alert('Failed to fetch questions.');
        });

    document.getElementById("updateButton").addEventListener("click", function () {
        const selectedQuestionId = document.querySelector('input[name="questionId"]:checked');
        if (!selectedQuestionId) {
            alert('Please select a question to update.');
            return;
        }
        window.location.href = `updateQuestion.html?questionId=${selectedQuestionId.value}`;
    });

    document.getElementById("deleteButton").addEventListener("click", function () {
        const selectedQuestionId = document.querySelector('input[name="questionId"]:checked');
        if (!selectedQuestionId) {
            alert('Please select a question to delete.');
            return;
        }

        fetch(`http://3.142.199.144:8083/quiz/deleteQuestion/${selectedQuestionId.value}`, { method: 'DELETE' })
            .then(response => {
                if (response.ok) {
                    alert('Question deleted successfully.');
                    location.reload(); // Reload the page to refresh the question list
                } else {
                    alert('Failed to delete question.');
                }
            })
            .catch(error => {
                console.error('Error deleting question:', error);
                alert('Failed to delete question.');
            });
    });
    document.getElementById("adminHome").addEventListener("click",function(){
        window.location.href="adminHome.html";
    });
});