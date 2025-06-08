const question = document.getElementById('question')
const choices = Array.from(document.getElementsByClassName("choice-text"))
const progressText = document.getElementById('progressText')
const scoreText = document.getElementById('score')
const progressBarFull = document.getElementById("progressBarFull")
const loader = document.getElementById('loader')
const game = document.getElementById('game')

let currentQuestion = {}
let acceptingAnswer = false
let score = 0
let questionCounter = 0
let availableQuestion = []

let questions = []

fetch('/public/data/questions.json')
    .then(res => {
        return res.json()
    })
    .then(loadedQuestions => {
        questions = loadedQuestions
        startGame();
    })
    .catch(err => {
        console.error(err)
        alert("No se pudo cargar el archivo de preguntas")
    })

/* Constants */

const CORRECT_BONUS = 10
const MAX_QUESTIONS = 10

startGame = () => {
    questionCounter = 0
    score = 0
    availableQuestion = [...questions]
    getNewQuestion()
    game.classList.remove('hidden')
    loader.classList.add('hidden')
}

getNewQuestion = () => {
    if (availableQuestion.length === 0 || questionCounter >= MAX_QUESTIONS) {
        // Guardar el puntaje más reciente
        localStorage.setItem('mostRecentScore', score)
        // Redirigir a la página de fin de juego
        return window.location.assign("/views/pages/end.html")
    }

    questionCounter++
    progressText.innerText = `Pregunta ${questionCounter}/${MAX_QUESTIONS}`
    /* Actualizar la barra de avance */
    progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`

    // Obtener una pregunta aleatoria
    const questionIndex = Math.floor(Math.random() * availableQuestion.length)
    currentQuestion = availableQuestion[questionIndex]
    question.innerText = currentQuestion.question

    // Crear un array con las opciones de respuesta
    const answerOptions = [
        { number: 1, text: currentQuestion.choice1 },
        { number: 2, text: currentQuestion.choice2 },
        { number: 3, text: currentQuestion.choice3 },
        { number: 4, text: currentQuestion.choice4 }
    ]

    // Mezclar las opciones de respuesta
    const shuffledOptions = answerOptions.sort(() => Math.random() - 0.5)

    // Actualizar el número de la respuesta correcta según el nuevo orden
    const correctAnswerIndex = shuffledOptions.findIndex(option => option.number === currentQuestion.answer)
    currentQuestion.answer = correctAnswerIndex + 1 // Actualizar el índice de la respuesta correcta

    // Actualizar las opciones en la interfaz
    choices.forEach((choice, index) => {
        const option = shuffledOptions[index]
        const number = index + 1
        choice.dataset.number = number
        choice.innerText = option.text
    })

    availableQuestion.splice(questionIndex, 1)
    acceptingAnswer = true
}

choices.forEach(choice => {
    choice.addEventListener('click', element => {
        if (!acceptingAnswer) return

        acceptingAnswer = false
        const selectedChoice = element.target
        const selectedAnswer = selectedChoice.dataset["number"]

        const classToApply =
            selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect'

        classToApply === "correct" ? incrementScore(CORRECT_BONUS)
            : console.log(`Error en la pregunta: ${currentQuestion.question}`)

        selectedChoice.parentElement.classList.add(classToApply)

        setTimeout(() => {
            selectedChoice.parentElement.classList.remove(classToApply)
            getNewQuestion()
        }, 1000)
    })
})

incrementScore = num => {
    score += num
    scoreText.innerText = score
}
