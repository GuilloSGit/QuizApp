const MAX_QUESTIONS = 1;
const CORRECT_BONUS = 10;

const question = document.getElementById('question');
const choices = Array.from(document.getElementsByClassName("choice-text"));
const progressText = document.getElementById('progressText');
const scoreText = document.getElementById('score');
const progressBarFull = document.getElementById("progressBarFull");
const loader = document.getElementById('loader');
const game = document.getElementById('game');

let currentQuestion = {};
let acceptingAnswer = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];
let questions = [];

function initGame() {
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const basePath = isLocal ? '' : '/QuizApp';
    const questionsPath = isLocal ? 
        '../../assets/data/questions.json' : 
        `${basePath}/assets/data/questions.json`;
    
    fetch(questionsPath)
        .then(res => {
            if (!res.ok) {
                throw new Error('No se pudieron cargar las preguntas');
            }
            return res.json();
        })
        .then(loadedQuestions => {
            questions = loadedQuestions;
            startGame();
        })
        .catch(err => {
            console.error('Error al cargar las preguntas:', err);
            const errorMessage = document.createElement('div');
            errorMessage.className = 'error-message';
            errorMessage.textContent = 'Error al cargar las preguntas. Por favor, recarga la página.';
            document.body.appendChild(errorMessage);
            // Ocultar el loader si hay un error
            const loader = document.getElementById('loader');
            if (loader) loader.classList.add('hidden');
        });
}

function startGame() {
    questionCounter = 0;
    score = 0;
    availableQuestions = [...questions];
    getNewQuestion();
    game.classList.remove('hidden');
    loader.classList.add('hidden');
}

function getNewQuestion() {
    if (availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) {
        localStorage.setItem('mostRecentScore', score);
        const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        const basePath = isLocal ? '' : '/QuizApp';
        const endPagePath = isLocal ? 
            '/views/pages/end.html' : 
            `${basePath}/views/pages/end.html`;
        return window.location.assign(endPagePath);
    }

    questionCounter++;
    progressText.innerText = `Pregunta ${questionCounter}/${MAX_QUESTIONS}`;
    progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

    const questionIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex];
    question.innerText = currentQuestion.question;

    const answerOptions = [
        { number: 1, text: currentQuestion.choice1 },
        { number: 2, text: currentQuestion.choice2 },
        { number: 3, text: currentQuestion.choice3 },
        { number: 4, text: currentQuestion.choice4 }
    ];

    const shuffledOptions = answerOptions.sort(() => Math.random() - 0.5);

    const correctAnswerIndex = shuffledOptions.findIndex(option => option.number === currentQuestion.answer);
    currentQuestion.answer = correctAnswerIndex + 1;
    choices.forEach((choice, index) => {
        const option = shuffledOptions[index];
        const number = index + 1;
        choice.dataset.number = number;
        choice.innerText = option.text;
        
        choice.parentElement.classList.remove('correct', 'incorrect');
    });

    availableQuestions.splice(questionIndex, 1);
    acceptingAnswer = true;
}

function setupEventListeners() {
    choices.forEach(choice => {
        choice.addEventListener('click', handleAnswer);
    });
}

function handleAnswer(e) {
    if (!acceptingAnswer) return;

    acceptingAnswer = false;
    const selectedChoice = e.target;
    const selectedAnswer = parseInt(selectedChoice.dataset.number);
    const isCorrect = selectedAnswer === currentQuestion.answer;

    choices.forEach(choice => {
        const choiceNumber = parseInt(choice.dataset.number);
        const parent = choice.parentElement;
        
        parent.classList.remove('correct', 'incorrect');
        
        if (choiceNumber === currentQuestion.answer) {
            parent.classList.add('correct');
        } 
        else if (choiceNumber === selectedAnswer) {
            parent.classList.add('incorrect');
        }
    });
    if (isCorrect) {
        incrementScore(CORRECT_BONUS);
    }

    setTimeout(() => {
        getNewQuestion();
    }, 2500);
}
function incrementScore(points) {
    score += points;
    scoreText.innerText = score;
}
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    initGame();
});

window.startGame = startGame;
window.getNewQuestion = getNewQuestion;
