// Mostrar la puntuación final cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    const finalScore = document.getElementById('finalScore');
    if (finalScore) {
        const mostRecentScore = localStorage.getItem('mostRecentScore') || '0';
        finalScore.textContent = mostRecentScore;
    }
    
    // Configurar el botón de guardar
    const usernameInput = document.getElementById('username');
    const saveButton = document.getElementById('saveScoreBtn');
    
    if (usernameInput && saveButton) {
        // Deshabilitar el botón inicialmente
        saveButton.disabled = true;
        
        // Habilitar/deshabilitar el botón según si hay texto
        usernameInput.addEventListener('input', () => {
            saveButton.disabled = !usernameInput.value.trim();
        });
    }
});
