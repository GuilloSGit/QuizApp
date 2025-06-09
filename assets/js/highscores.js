// PathUtils está disponible globalmente
const PathUtils = window.PathUtils || {
    getAbsolutePath: (path) => path,
    navigateTo: (path) => { window.location.href = path; },
    getResourceUrl: (type, filename) => `assets/${type}/${filename}`
};

// Elementos del DOM
const highScoresList = document.getElementById('otherScoresList');
const confettiContainer = document.querySelector('.confetti-container');

// Depuración
const podiumItems = {
    first: document.querySelector('.first-place'),
    second: document.querySelector('.second-place'),
    third: document.querySelector('.third-place')
};

// Obtener y ordenar los puntajes
let highScores = JSON.parse(localStorage.getItem('highScores')) || [];
highScores.sort((a, b) => b.score - a.score);

// Colores para los confetis
const confettiColors = [
    '#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5',
    '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50',
    '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722'
];

// Función para crear múltiples confetis a la vez
window.createConfettiBurst = function(amount = 15) {
    for (let i = 0; i < amount; i++) {
        setTimeout(() => createConfetti(), i * 50);
    }
}

// Función para crear un solo confeti con movimiento realista
function createConfetti() {
    try {
        const confettiContainer = document.querySelector('.confetti-container');
        if (!confettiContainer) {
            console.warn('No se encontró el contenedor de confetis');
            return;
        }
        
        const confetti = document.createElement('div');
        
        // Tipos de confeti (cuadrado, círculo o triángulo)
        const types = ['square', 'circle', 'triangle'];
        const type = types[Math.floor(Math.random() * types.length)];
        confetti.className = `confetti ${type}`;
        
        // Posición aleatoria en la parte superior de la pantalla (incluyendo fuera de la vista)
        const posX = (Math.random() * (window.innerWidth + 200)) - 100;
        
        // Tamaño aleatorio
        const size = Math.random() * 19 + 16; // Entre 16px y 25px
        
        // Color aleatorio
        const color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
        
        // Variables para la animación
        const driftX = (Math.random() - 0.5) * 200; // Movimiento horizontal aleatorio
        const rotation = (Math.random() - 0.5) * 360; // Rotación inicial entre -180 y 180 grados
        const randomX = (Math.random() - 0.5) * 2; // Movimiento horizontal aleatorio adicional
    
        // Establecer estilos
        confetti.style.left = `${posX}px`;
        confetti.style.top = '0';
        confetti.style.width = type !== 'triangle' ? `${size}px` : '0';
        confetti.style.height = type !== 'triangle' ? `${size}px` : '0';
        
        if (type === 'triangle') {
            confetti.style.borderLeft = `${size/2}px solid transparent`;
            confetti.style.borderRight = `${size/2}px solid transparent`;
            confetti.style.borderBottom = `${size}px solid ${color}`;
            confetti.style.background = 'none';
        } else {
            confetti.style.backgroundColor = color;
        }
        
        confetti.style.opacity = Math.random() * 0.7 + 0.3; // Opacidad entre 0.3 y 1
        
        // Variables CSS personalizadas para la animación
        confetti.style.setProperty('--drift-x', driftX);
        confetti.style.setProperty('--rotation', rotation);
        confetti.style.setProperty('--random-x', randomX);
        
        // Duración y retraso aleatorios
        const duration = Math.random() * 3 + 5; // Entre 5 y 8 segundos
        const delay = Math.random() * 2; // Hasta 2 segundos de retraso
        
        // Aplicar animación
        confetti.style.animation = `fall ${duration}s linear ${delay}s forwards`;
        
        // Añadir confeti al contenedor
        confettiContainer.appendChild(confetti);
        
        // Eliminar el confeti después de que termine la animación
        setTimeout(() => {
            if (confetti.parentNode === confettiContainer) {
                confettiContainer.removeChild(confetti);
            }
        }, (duration + delay) * 1000);
        
        return confetti;
    } catch (error) {
        console.error('Error al crear confeti:', error);
        return null;
    }
}

// Función para mostrar los puntajes en el podio
function displayPodiumScores(scores) {
    // Primer lugar
    if (scores[0]) {
        podiumItems.first.querySelector('.podium-name').textContent = scores[0].name || 'Anónimo';
        podiumItems.first.querySelector('.podium-score').textContent = `${scores[0].score} pts`;
    }
    
    // Segundo lugar
    if (scores[1]) {
        podiumItems.second.querySelector('.podium-name').textContent = scores[1].name || 'Anónimo';
        podiumItems.second.querySelector('.podium-score').textContent = `${scores[1].score} pts`;
    }
    
    // Tercer lugar
    if (scores[2]) {
        podiumItems.third.querySelector('.podium-name').textContent = scores[2].name || 'Anónimo';
        podiumItems.third.querySelector('.podium-score').textContent = `${scores[2].score} pts`;
    }
}

// Función para mostrar otros puntajes
function displayOtherScores(scores) {
    if (scores.length === 0) {
        highScoresList.innerHTML = '<li class="score-item">No hay más puntajes</li>';
        return;
    }
    
    highScoresList.innerHTML = scores.map((score, index) => {
        return `
            <li class="score-item">
                <span class="position">#${index + 4}</span>
                <span class="name">${score.name || 'Anónimo'}</span>
                <span class="points">${score.score} pts</span>
            </li>
        `;
    }).join('');
}

// Inicializar
function init() {
    try {
        // Mostrar puntajes en el podio (primeros 3)
        const podiumScores = highScores.slice(0, 3);
        displayPodiumScores(podiumScores);
        
        // Mostrar otros puntajes (del 4to en adelante, máximo 3 más)
        const otherScores = highScores.slice(3, 6);
        displayOtherScores(otherScores);
        
        // Verificar si el navegador es compatible con las animaciones
        const supportsAnimations = 'requestAnimationFrame' in window;
        
        // Crear confeti si hay puntajes y el navegador es compatible
        if (highScores.length > 0 && supportsAnimations) {
            // Esperar un momento para asegurar que el DOM esté listo
            setTimeout(() => {
                // Crear ráfagas iniciales de confeti
                for (let i = 0; i < 3; i++) {
                    setTimeout(() => createConfettiBurst(20), i * 1000);
                }
                
                // Crear ráfagas continuas de confeti con menor frecuencia
                const confettiInterval = setInterval(() => {
                    if (Math.random() > 0.5) {
                        createConfettiBurst(Math.floor(Math.random() * 10) + 5);
                    }
                }, 2000);
                
                // Detener la generación de confeti después de 20 segundos
                setTimeout(() => {
                    clearInterval(confettiInterval);
                }, 20000);
                
                // Generar confeti adicional al hacer clic en cualquier parte
                document.addEventListener('click', () => {
                    createConfettiBurst(15);
                });
            }, 500);
        } else if (!supportsAnimations) {
            console.log('Animaciones no soportadas en este navegador');
        }
    } catch (error) {
        console.error('Error en la inicialización de la página de puntuaciones:', error);
    }
}

// Iniciar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Hacer la función de navegación accesible globalmente
if (window) {
    window.navigateTo = PathUtils.navigateTo;
}
