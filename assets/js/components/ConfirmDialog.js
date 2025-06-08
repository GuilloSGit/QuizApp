/**
 * Componente de diálogo de confirmación
 */
class ConfirmDialog extends window.Component {
  render() {
    return `
      <div class="modal" id="${this.props.id}">
        <div class="modal-content">
          <h4 style="color: #000; font-size: 1.2rem">${this.props.title || '¿Estás seguro?'}</h4>
          <p style="color: #000; font-size: 1.2rem">${this.props.message || 'Esta acción no se puede deshacer.'}</p>
          <div class="modal-actions">
            <button id="confirmBtn" class="btn btn-danger" data-ref="confirmBtn">
              ${this.props.confirmText || 'Confirmar'}
            </button>
            <button id="cancelBtn" class="btn" data-ref="cancelBtn">
              ${this.props.cancelText || 'Cancelar'}
            </button>
          </div>
        </div>
      </div>
    `;
  }

  componentDidMount() {
    // Asegurarse de que el diálogo tenga el HTML necesario
    this.element.innerHTML = `
      <div class="modal-content">
        <h4 style="color: #000; font-size: 1.2rem">${this.props.title || '¿Estás seguro?'}</h4>
        <p style="color: #000; font-size: 1.2rem">${this.props.message || '¿Deseas continuar?'}</p>
        <div class="modal-actions">
          <button class="btn btn-cancel" data-ref="cancelBtn">
            ${this.props.cancelText || 'Cancelar'}
          </button>
          <button class="btn btn-confirm" data-ref="confirmBtn">
            ${this.props.confirmText || 'Aceptar'}
          </button>
        </div>
      </div>
    `;
    
    // Asegurarse de que el diálogo esté oculto inicialmente
    this.element.style.display = 'none';
    
    // Configurar referencias a los botones
    this.confirmBtn = this.element.querySelector('[data-ref="confirmBtn"]');
    this.cancelBtn = this.element.querySelector('[data-ref="cancelBtn"]');
    
    // Configurar manejadores de eventos
    if (this.confirmBtn) {
      this.handleConfirmBound = this.handleConfirm.bind(this);
      this.confirmBtn.addEventListener('click', this.handleConfirmBound);
    } else {
      console.warn('No se encontró el botón de confirmar');
    }
    
    if (this.cancelBtn) {
      this.handleCancelBound = this.handleCancel.bind(this);
      this.cancelBtn.addEventListener('click', this.handleCancelBound);
    } else {
      console.warn('No se encontró el botón de cancelar');
    }
    
    // Cerrar al hacer clic fuera del diálogo
    this.handleClickOutside = (e) => {
      if (e.target === this.element) {
        this.hide();
      }
    };
    
    this.element.addEventListener('click', this.handleClickOutside);
    
    // Hacer que el diálogo esté disponible globalmente
    window.confirmDialogInstance = this;
    
    // Ocultar el diálogo por defecto
    this.hide();
  }
  
  componentWillUnmount() {
    if (this.confirmBtn) {
      this.confirmBtn.removeEventListener('click', this.handleConfirm);
    }
    if (this.cancelBtn) {
      this.cancelBtn.removeEventListener('click', this.handleCancel);
    }
  }

  show() {
    if (this.element) {
      // Asegurarse de que el elemento sea visible
      this.element.style.display = 'flex';
      // Forzar un reflow para que la animación funcione
      void this.element.offsetWidth;
      // Aplicar la clase show para la animación
      this.element.classList.add('show');
      
      // Enfocar el botón de cancelar por defecto para mejor accesibilidad
      if (this.cancelBtn) {
        setTimeout(() => {
          this.cancelBtn.focus();
        }, 100);
      }
    } else {
      console.warn('No se puede mostrar el diálogo: elemento no encontrado');
    }
  }

  hide() {
    if (this.element) {
      // Primero quitamos la clase para la animación
      this.element.classList.remove('show');
      // Esperamos a que termine la animación para ocultar el elemento
      setTimeout(() => {
        if (this.element) {
          this.element.style.display = 'none';
        }
      }, 300); // Debe coincidir con la duración de la transición CSS
    } else {
      console.warn('No se puede ocultar el diálogo: elemento no encontrado');
    }
  }

  confirm() {
    this.handleConfirm();
  }

  cancel() {
    this.handleCancel();
  }

  handleConfirm() {
    if (typeof this.props.onConfirm === 'function') {
      this.props.onConfirm();
    }
    this.hide();
  }

  handleCancel() {
    if (typeof this.props.onCancel === 'function') {
      this.props.onCancel();
    }
    this.hide();
  }
}

// Registrar el componente globalmente
if (window) {
  window.ConfirmDialog = ConfirmDialog;
}

export default ConfirmDialog;
