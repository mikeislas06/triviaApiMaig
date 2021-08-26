const triviaContainer = document.getElementById("triviaContainer");
const score = document.getElementById("score");
const incorrectAnswers = document.getElementById("incorrectAnswers");
const scoreContainer = document.getElementById("scoreContainer");
const goBtn = document.getElementById("goBtn");
const number = document.getElementById("number");
const category = document.getElementById("category");
const difficulty = document.getElementById("difficulty");
const type = document.getElementById("type");

let questionsArray = [];
let q = 0;
let scoreCorrect = 0;
let incorrectAnswersScore = 0;
let finalFlag = false;

goBtn.addEventListener("click", () => {
  triviaContainer.innerHTML = "";
  let search = "amount=" + number.value;
  if (category.value !== "any") {
    search += "&category=" + category.value;
  }
  if (difficulty.value !== "any") {
    search += "&difficulty=" + difficulty.value;
  }
  if (type.value !== "any") {
    search += "&type=" + type.value;
  }

  const APIURL = "https://opentdb.com/api.php?" + search;

  getQuestions(APIURL);
  clearForm();
});

function clearForm() {
  number.value = "10";
  category.value = "any";
  difficulty.value = "any";
  type.value = "any";
}

async function getQuestions(url) {
  const respData = fetch(url)
    .then((response) => response.json())
    .then((result) => showOneQuestion(result.results, q));
}

function showOneQuestion(questions, q){
    triviaContainer.innerHTML = "";
    //Creating trivia components containers
    const triviaCard = document.createElement("div");
    const qTitle = document.createElement("div");
    const qCategory = document.createElement("div");
    const qButton = document.createElement("div");
    const qAnswers = document.createElement("div");

    //Adding class list to all trivia components containers
    triviaCard.classList.add("trivia-card");
    qTitle.classList.add("q-title");
    qCategory.classList.add("q-category");
    qButton.classList.add("q-button");
    qAnswers.classList.add("q-answers");

    //Adding child containers to Trivia Card
    triviaCard.appendChild(qCategory);
    triviaCard.appendChild(qTitle);
    triviaCard.appendChild(qAnswers);
    triviaCard.appendChild(qButton);

    //Creating inner tags for every container
    const category = document.createElement("h6");
    const title = document.createElement("h5");
    const button = document.createElement("button");

    //Adding text fetched from API object
    category.innerHTML = "Category: " + questions[q].category;
    title.innerHTML = questions[q].question;
    button.innerText = "Check Answer";

    //Adding child tags to containers
    qCategory.appendChild(category);
    qTitle.appendChild(title);
    button.setAttribute("type", "submit");
    // button.onclick = checkCorrectAnswer(question);
    button.addEventListener('click', () => {
        const questionAnswers = document.getElementsByName(questions[q].question);
        let selectedAnswer = "";
        for (let i = 0; i < questionAnswers.length; i++) {
            const element = questionAnswers[i];
            if(element.checked){
                selectedAnswer = element.value;
            }
        }
        if(selectedAnswer === questions[q].correct_answer){
            scoreCorrect++;
            score.innerText = scoreCorrect;
        }
        else{
            incorrectAnswersScore++;
            incorrectAnswers.innerText = incorrectAnswersScore
        }
        q++;
        verifyLastQuestion(questions.length, q);
        if(!finalFlag){
            showOneQuestion(questions, q);
        }
    });
    qButton.appendChild(button);

    //Creating options radio buttons
    const option = document.createElement("div");
    option.classList.add("option");

    let answers = [];
    const correctAnswer = document.createElement("input");
    const correctAnswerLabel = document.createElement("label");

    correctAnswer.setAttribute("type", "radio");
    correctAnswer.setAttribute("id", questions[q].correct_answer);
    correctAnswer.setAttribute("name", questions[q].question);
    correctAnswer.setAttribute("value", questions[q].correct_answer);
    correctAnswerLabel.setAttribute("for", questions[q].correct_answer);
    correctAnswerLabel.innerHTML = questions[q].correct_answer;

    option.appendChild(correctAnswer);
    option.appendChild(correctAnswerLabel);
    answers.push(option);

    questions[q].incorrect_answers.forEach((incorrect_answer) => {
      const option = document.createElement("div");
      option.classList.add("option");
      const incorrectAnswer = document.createElement("input");
      const incorrectAnswerLabel = document.createElement("label");

      incorrectAnswer.setAttribute("type", "radio");
      incorrectAnswer.setAttribute("id", incorrect_answer);
      incorrectAnswer.setAttribute("name", questions[q].question);
      incorrectAnswer.setAttribute("value", incorrect_answer);
      incorrectAnswerLabel.setAttribute("for", incorrect_answer);
      incorrectAnswerLabel.innerHTML = incorrect_answer;

      option.appendChild(incorrectAnswer);
      option.appendChild(incorrectAnswerLabel);
      answers.push(option);
    });

    shuffle(answers);
    answers.forEach((answer) => {
      qAnswers.appendChild(answer);
    });

    triviaContainer.appendChild(triviaCard);
}

function showFinalScore(){
    triviaContainer.innerHTML = "";
    scoreContainer.innerHTML = "";

    const finalScoreCard = document.createElement("div");
    finalScoreCard.classList = "final-score-card";
    const finalScore = document.createElement("h4");
    const finalScoreNumber = document.createElement("span");

    finalScore.innerHTML = "Your final score is: ";
    finalScoreNumber.innerHTML = scoreCorrect;
    finalScore.appendChild(finalScoreNumber);

    finalScoreCard.appendChild(finalScore);
    triviaContainer.appendChild(finalScoreCard);
}

function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
  return array;
}

function verifyLastQuestion(length, q){
    if(length === q){
        showFinalScore();
        finalFlag = true;
    }

}