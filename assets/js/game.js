(function() {
    'use strict';

    const MAX_QUESTIONS = 10;
    const CORRECT_BONUS = 10;

    // Usar window.PathUtils directamente o inicializar si no existe
    if (!window.PathUtils) {
        window.PathUtils = {
            getAbsolutePath: function(path) { return path; },
            navigateTo: function(path) { window.location.href = path; },
            getResourceUrl: function(type, filename) { return `assets/${type}/${filename}`; }
        };
    }
    const PathUtils = window.PathUtils;

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
        const questionsPath = PathUtils.getResourceUrl('data', 'questions.json');
        
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
                if (loader) loader.classList.add('hidden');
            });
    }

    function startGame() {
        questionCounter = 0;
        score = 0;
        availableQuestions = [...questions];
        getNewQuestion();
        if (game) game.classList.remove('hidden');
        if (loader) loader.classList.add('hidden');
    }

    function getNewQuestion() {
        if (availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) {
            localStorage.setItem('mostRecentScore', score);
            return PathUtils.navigateTo('views/pages/end.html');
        }

        questionCounter++;
        if (progressText) progressText.innerText = `Pregunta ${questionCounter}/${MAX_QUESTIONS}`;
        if (progressBarFull) progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

        const questionIndex = Math.floor(Math.random() * availableQuestions.length);
        currentQuestion = availableQuestions[questionIndex];
        if (question) question.innerText = currentQuestion.question;

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
            
            if (choice.parentElement) {
                choice.parentElement.classList.remove('correct', 'incorrect');
            }
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
            
            if (parent) {
                parent.classList.remove('correct', 'incorrect');
                
                if (choiceNumber === currentQuestion.answer) {
                    parent.classList.add('correct');
                } 
                else if (choiceNumber === selectedAnswer) {
                    parent.classList.add('incorrect');
                }
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
        if (scoreText) scoreText.innerText = score;
    }

    function setupBackButton() {
        const backButton = document.querySelector('back-button');
        if (!backButton) {
            console.warn('No se encontró el botón de volver en el DOM');
        }
    }

    // Inicialización
    document.addEventListener('DOMContentLoaded', () => {
        setupBackButton();
        setupEventListeners();
        initGame();
    });

    // Hacer funciones disponibles globalmente si es necesario
    window.startGame = startGame;
    window.getNewQuestion = getNewQuestion;
})();
