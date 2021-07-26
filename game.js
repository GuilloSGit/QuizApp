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

fetch('questions.json')
    .then(res => {
        return res.json()
    })
    .then(loadedQuestions => {
        questions = loadedQuestions
        startGame();
    })
    .catch(err => {
        console.error(err)
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

        localStorage.setItem('mostRecentScore', score)
        /* va a la página final */
        return window.location.assign("/QuizApp/end.html")
    }
    
    questionCounter++
    progressText.innerText = `Pregunta ${questionCounter}/${MAX_QUESTIONS}`
    /* Actualizar la barra de avance */
    progressBarFull.style.width = `${(questionCounter/ MAX_QUESTIONS) * 100}%`

    const questionIndex = Math.floor(Math.random() * availableQuestion.length)
    currentQuestion = availableQuestion[questionIndex]
    question.innerText = currentQuestion.question

    choices.forEach(choice => {
        const number = choice.dataset['number']
        choice.innerText = currentQuestion['choice' + number]
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
