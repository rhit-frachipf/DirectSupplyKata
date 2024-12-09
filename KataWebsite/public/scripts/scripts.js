//array of current quiz questions
let currentQuiz = [];

//open the main page
function initializeMain() {
    document.querySelector("#startQuiz").addEventListener("click", () => {
        const questionCount = document.querySelector("#questionCount").value;
        const category = document.querySelector("#category").value;

        if (questionCount < 1 || questionCount > 50) {
            alert("pick select a number between 1 and 50.");
            return;
        }
        
        //open the quiz page with the given parameters
        window.location.href = `quiz.html?questions=${questionCount}&category=${category}`;
    });
}

//load quiz questions from the api page
function loadQuiz() {
    const params = new URLSearchParams(window.location.search);
    const questionCount = params.get("questions");
    const category = params.get("category");
    const difficulty = "medium";
    const type = "multiple";

    const url = `https://opentdb.com/api.php?amount=${questionCount}&category=${category}&difficulty=${difficulty}&type=${type}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.response_code === 0) {
                currentQuiz = data.results;
                renderQuiz();
            }
            else {
                console.error("cant fetch quiz:", data);
            }
        });
}


//open the quiz page with the new questions
function renderQuiz() {
    const quizContainer = document.getElementById("quizContainer");
    quizContainer.innerHTML = "";

    const createQuestionElement = (question, index) => {
        const answers = [...question.incorrect_answers, question.correct_answer]
            //randomize question answers so theyre in different orders
            .sort(() => Math.random() - 0.5)
            .map((answer) => `<label><input type="radio" name="q${index}" value="${answer}"> ${answer}</label>`)
            .join("<br>");
        return `
            <div>
                <p>${index + 1}. ${question.question}</p>
                ${answers}
            </div>`;
    };
    
    currentQuiz.forEach((question, index) => {
        const questionElement = document.createElement("div");
        questionElement.innerHTML = createQuestionElement(question, index);
        quizContainer.appendChild(questionElement);
    });

    document.getElementById("submitQuiz").style.display = "inline-block";
}

//calculate score
function submitQuiz() {
    const user = prompt("Enter your username:");
    let score = 0;

    currentQuiz.forEach((question, index) => {
        const selected = document.querySelector(`input[name="q${index}"]:checked`);
        if (selected && selected.value === question.correct_answer) score++;
    });
    const totalQuestions = currentQuiz.length;

    fetch("/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user, score }),
    })
        .then(() => {
            window.location.href = `scores.html?user=${user}&score=${score}&total=${totalQuestions}`;
        })
        .catch(error => console.error("cant save score:", error));
}

//load the scores for the leaderboard
function loadScores() {
    const params = new URLSearchParams(window.location.search);
    const user = params.get("user");
    const userScore = params.get("score");
    const totalQuestions = params.get("total");

    fetch("/leaderboard")
        .then(response => response.json())
        .then(leaderboard => {
            const table = document.getElementById("leaderboard");

            leaderboard.forEach((entry, index) => {
                const row = table.insertRow();
                row.innerHTML = `<td>${index + 1}</td><td>${entry[0]}</td><td>${entry[1]}</td>`;
            });

            if (user && userScore && totalQuestions) {
                const userRow = table.insertRow();
                userRow.innerHTML = `<td>-</td><td>${user}</td><td>${userScore}/${totalQuestions}</td>`;
            }
        })
        .catch(error => console.error("cant load leaderboard:", error));
}

//go back to the main page
function goToMain() {
    window.location.href = "main.html";
}
