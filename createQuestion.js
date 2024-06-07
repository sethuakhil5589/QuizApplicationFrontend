document.getElementById("questionForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const questionData = {
        question: document.getElementById("question").value,
        option1: document.getElementById("option1").value,
        option2: document.getElementById("option2").value,
        option3: document.getElementById("option3").value,
        option4: document.getElementById("option4").value,
        answer: document.getElementById("answer").value,
        topic: document.getElementById("topic").value,
    };

    fetch('http://18.222.200.25:8083/quiz/addQuestion', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(questionData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to save question');
        }
        return response.text();
    })
    .then(data => {
        alert(data);
        window.location.href = "adminHome.html"; // Redirect to admin home after successful save
    })
    .catch(error => {
        console.error('Error saving question:', error);
        alert('Failed to save question.');
    });
});