document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const questionId = urlParams.get('questionId');
    if (!questionId) {
        alert('Missing question ID. Please try again.');
        window.location.href = "updateOrDeleteQuestion.html";
        return;
    }

    // Fetch question details
    fetch(`http://3.142.222.173:8082/questions/getQuestion/${questionId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch question details');
            }
            return response.json();
        })
        .then(data => {
            document.getElementById('questionId').value = data.questionId;
            document.getElementById('question').value = data.question;
            document.getElementById('option1').value = data.option1;
            document.getElementById('option2').value = data.option2;
            document.getElementById('option3').value = data.option3;
            document.getElementById('option4').value = data.option4;
            document.getElementById('answer').value = data.answer;
            document.getElementById('topic').value = data.topic;
        })
        .catch(error => {
            console.error('Error fetching question details:', error);
            alert('Failed to fetch question details.');
        });

    document.getElementById("updateQuestionForm").addEventListener("submit", function (event) {
        event.preventDefault();

        const questionData = {
            questionId: parseInt(document.getElementById("questionId").value),
            question: document.getElementById("question").value,
            option1: document.getElementById("option1").value,
            option2: document.getElementById("option2").value,
            option3: document.getElementById("option3").value,
            option4: document.getElementById("option4").value,
            answer: document.getElementById("answer").value,
            topic: document.getElementById("topic").value,
        };

        fetch('http://18.222.200.25:8083/quiz/updateQuestion', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(questionData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to update question');
            }
            return response.text();
        })
        .then(data => {
            alert(data);
            window.location.href = "updateOrDeleteQuestion.html"; // Redirect after successful update
        })
        .catch(error => {
            console.error('Error updating question:', error);
            alert('Failed to update question.');
        });
    });
});