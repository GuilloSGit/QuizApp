/**
 * Componente de botón de volver
 */
class BackButton extends window.Component {
  render() {
    // Usar el contenido existente si ya hay algo en el elemento
    if (this.element.innerHTML.trim() === '') {
      this.element.innerHTML = `
        <button class="btn leave-game" data-ref="button">
          <img src="/public/assets/images/back.svg" alt="Volver">
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
    
    // Buscar el diálogo de confirmación
    const dialogElement = document.getElementById('confirmDialog');
    let dialog = null;
    
    // Si encontramos el diálogo, mostrarlo
    if (dialogElement && window.ConfirmDialog) {
      // Si el diálogo tiene un método show, usarlo
      if (dialogElement.show) {
        dialogElement.show();
      } 
      // Si no, buscar la instancia del diálogo
      else if (window.confirmDialogInstance) {
        window.confirmDialogInstance.show();
      } else {
        console.warn('No se pudo encontrar el método show en el diálogo');
      }
    } 
    // Si no hay diálogo, ejecutar la acción directamente
    else if (typeof this.props.onClick === 'function') {
      this.props.onClick();
    } else if (this.element.dataset.href) {
      window.location.href = this.element.dataset.href;
    }
  }
}

// Registrar el componente globalmente
if (window) {
  window.BackButton = BackButton;
}

export default BackButton;
