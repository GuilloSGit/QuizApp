// Constantes
const MAX_QUESTIONS = 5;
const CORRECT_BONUS = 10; // Puntos por respuesta correcta

// Elementos del DOM
const question = document.getElementById('question');
const choices = Array.from(document.getElementsByClassName("choice-text"));
const progressText = document.getElementById('progressText');
const scoreText = document.getElementById('score');
const progressBarFull = document.getElementById("progressBarFull");
const loader = document.getElementById('loader');
const game = document.getElementById('game');

// Estado del juego
let currentQuestion = {};
let acceptingAnswer = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];
let questions = [];

// Inicializar el juego
function initGame() {
    fetch('/public/data/questions.json')
        .then(res => res.json())
        .then(loadedQuestions => {
            questions = loadedQuestions;
            startGame();
        })
        .catch(err => {
            const errorMessage = document.createElement('div');
            errorMessage.className = 'error-message';
            errorMessage.textContent = 'Error al cargar las preguntas. Por favor, recarga la página.';
            document.body.appendChild(errorMessage);
        });
}

// Funciones del juego
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
        return window.location.assign("/views/pages/end.html");
    }

    questionCounter++;
    progressText.innerText = `Pregunta ${questionCounter}/${MAX_QUESTIONS}`;
    // Actualizar la barra de avance
    progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

    // Obtener una pregunta aleatoria
    const questionIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex];
    question.innerText = currentQuestion.question;

    // Crear un array con las opciones de respuesta
    const answerOptions = [
        { number: 1, text: currentQuestion.choice1 },
        { number: 2, text: currentQuestion.choice2 },
        { number: 3, text: currentQuestion.choice3 },
        { number: 4, text: currentQuestion.choice4 }
    ];

    // Mezclar las opciones de respuesta
    const shuffledOptions = answerOptions.sort(() => Math.random() - 0.5);

    // Actualizar el número de la respuesta correcta según el nuevo orden
    const correctAnswerIndex = shuffledOptions.findIndex(option => option.number === currentQuestion.answer);
    currentQuestion.answer = correctAnswerIndex + 1; // Actualizar el índice de la respuesta correcta

    // Actualizar las opciones en la interfaz
    choices.forEach((choice, index) => {
        const option = shuffledOptions[index];
        const number = index + 1;
        choice.dataset.number = number;
        choice.innerText = option.text;
        
        // Asegurarse de que las clases de selección se reinicien
        choice.parentElement.classList.remove('correct', 'incorrect');
    });

    availableQuestions.splice(questionIndex, 1);
    acceptingAnswer = true;
}

// Agregar manejadores de eventos a las opciones de respuesta
function setupEventListeners() {
    choices.forEach(choice => {
        choice.addEventListener('click', handleAnswer);
    });
}

// Manejar la selección de respuesta
function handleAnswer(e) {
    if (!acceptingAnswer) return;

    acceptingAnswer = false;
    const selectedChoice = e.target;
    const selectedAnswer = parseInt(selectedChoice.dataset.number);
    const isCorrect = selectedAnswer === currentQuestion.answer;

    // Resaltar todas las respuestas
    choices.forEach(choice => {
        const choiceNumber = parseInt(choice.dataset.number);
        const parent = choice.parentElement;
        
        // Limpiar clases anteriores
        parent.classList.remove('correct', 'incorrect');
        
        // Marcar la respuesta correcta
        if (choiceNumber === currentQuestion.answer) {
            parent.classList.add('correct');
        } 
        // Marcar la respuesta seleccionada como incorrecta (si no es la correcta)
        else if (choiceNumber === selectedAnswer) {
            parent.classList.add('incorrect');
        }
    });

    // Si es correcta, incrementar el puntaje
    if (isCorrect) {
        incrementScore(CORRECT_BONUS);
    }

    // Pasar a la siguiente pregunta después de un breve retraso
    setTimeout(() => {
        getNewQuestion();
    }, 2500);
}

// Incrementar el puntaje
function incrementScore(points) {
    score += points;
    scoreText.innerText = score;
}

// Inicializar el juego cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Configurar los manejadores de eventos
    setupEventListeners();
    
    // Iniciar el juego
    initGame();
});

// Hacer que las funciones estén disponibles globalmente si es necesario
window.startGame = startGame;
window.getNewQuestion = getNewQuestion;
