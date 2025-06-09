// Utilidad para obtener la ruta base correcta
function getBasePath() {
  return (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') 
    ? '' 
    : '/QuizApp';
}

// Función para obtener la ruta completa
function getFullPath(path) {
  if (!path) return '/';
  const basePath = getBasePath();
  
  // Si ya es una URL completa o comienza con http, devolverla tal cual
  if (path.startsWith('http') || path.startsWith('//') || path.startsWith('data:')) {
    return path;
  }
  
  // Si la ruta ya comienza con el basePath, devolverla tal cual
  if (basePath && path.startsWith(basePath)) {
    return path;
  }
  
  // Si la ruta comienza con /, agregar basePath
  if (path.startsWith('/')) {
    return basePath + path;
  }
  
  // Para rutas relativas, agregar basePath si es necesario
  return basePath + '/' + path;
}

/**
 * Componente de botón de volver personalizado
 */
class BackButton extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.handleClick = this.handleClick.bind(this);
  }

  connectedCallback() {
    this.render();
    
    // Configurar el botón
    this.button = this.shadowRoot.querySelector('button');
    if (this.button) {
      this.button.addEventListener('click', this.handleClick);
    } else {
      console.warn('No se pudo encontrar el botón en el componente BackButton');
    }
  }

  disconnectedCallback() {
    if (this.button) {
      this.button.removeEventListener('click', this.handleClick);
    }
  }

  render() {
    const backImagePath = getFullPath('assets/images/back.svg');
    
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-block;
        }
        button {
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 1rem;
          padding: 8px 16px;
          border-radius: 4px;
          transition: background-color 0.2s;
        }
        button:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }
        img {
          width: 20px;
          height: 20px;
        }
      </style>
      <button class="btn leave-game" style="margin: 0 0 1rem -1rem">
        <img src="${backImagePath}" alt="Volver">
        <span style="color:#000">Volver</span>
      </button>
    `;
  }

  handleClick(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const href = this.getAttribute('href') || '/';
    const confirmMessage = this.getAttribute('confirm-message');
    
    if (confirmMessage) {
      // Crear y mostrar el diálogo de confirmación
      const dialog = document.createElement('confirm-dialog');
      dialog.setAttribute('title', this.getAttribute('confirm-title') || '¿Estás seguro?');
      dialog.setAttribute('message', confirmMessage);
      dialog.setAttribute('confirm-text', this.getAttribute('confirm-text') || 'Sí, salir');
      dialog.setAttribute('cancel-text', this.getAttribute('cancel-text') || 'Cancelar');
      
      dialog.addEventListener('confirm', () => {
        window.location.href = getFullPath(href);
      });
      
      document.body.appendChild(dialog);
      dialog.show();
    } else {
      // Navegar directamente si no hay mensaje de confirmación
      window.location.href = getFullPath(href);
    }
  }
}

// Registrar el componente personalizado
if (!customElements.get('back-button')) {
  customElements.define('back-button', BackButton);
}
