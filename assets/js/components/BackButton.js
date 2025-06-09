// Importar utilidades de rutas
import PathUtils from '../utils/pathUtils.js';

/**
 * Componente de botón de volver
 */
class BackButton extends window.Component {
  render() {
    // Usar el contenido existente si ya hay algo en el elemento
    if (this.element.innerHTML.trim() === '') {
      this.element.innerHTML = `
        <button class="btn leave-game" data-ref="button">
          <img src="../../assets/images/back.svg" alt="Volver">
          Volver
        </button>
      `;
    }
    return this.element.innerHTML;
  }

  componentDidMount() {
    this.button = this.element.querySelector('[data-ref="button"]');
    if (this.button) {
      this.handleClickBound = this.handleClick.bind(this);
      this.button.addEventListener('click', this.handleClickBound);
    } else {
      console.warn('No se encontró el botón en el componente BackButton');
    }
  }

  componentWillUnmount() {
    if (this.button && this.handleClickBound) {
      this.button.removeEventListener('click', this.handleClickBound);
    }
  }

  handleClick(e) {
    e.preventDefault();
    e.stopPropagation();
    
    // Si hay una acción de confirmación, manejarla
    if (this.element.dataset.confirmAction === 'navigate') {
      const href = this.element.dataset.href || '/';
      const usePathUtils = this.element.hasAttribute('data-use-path-utils');
      
      // Si hay un diálogo de confirmación, mostrarlo
      const dialogElement = document.getElementById('confirmDialog');
      if (dialogElement && window.ConfirmDialog) {
        const dialog = new window.ConfirmDialog({
          title: this.element.dataset.confirmTitle || '¿Estás seguro?',
          message: this.element.dataset.confirmMessage || '¿Quieres salir del juego?',
          confirmText: this.element.dataset.confirmText || 'Sí, salir',
          cancelText: this.element.dataset.cancelText || 'Cancelar',
          onConfirm: () => {
            if (usePathUtils) {
              PathUtils.navigateTo(href);
            } else {
              window.location.href = href;
            }
          }
        });
        dialog.show();
      } else {
        // Si no hay diálogo, navegar directamente
        if (usePathUtils) {
          PathUtils.navigateTo(href);
        } else {
          window.location.href = href;
        }
      }
    } else if (this.props.onClick) {
      // Si hay un manejador de clic personalizado, usarlo
      this.props.onClick(e);
    } else if (this.element.href) {
      // Navegar al enlace si no hay manejador personalizado
      window.location.href = this.element.href;
    }
  }
}

// Registrar el componente personalizado
if (!customElements.get('back-button')) {
  customElements.define('back-button', BackButton);
}

export default BackButton;
