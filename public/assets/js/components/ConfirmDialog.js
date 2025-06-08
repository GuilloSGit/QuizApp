/**
 * Componente de diálogo de confirmación
 */
class ConfirmDialog extends window.Component {
  render() {
    return `
      <div class="modal" id="${this.props.id}">
        <div class="modal-content">
          <h3>${this.props.title || '¿Estás seguro?'}</h3>
          <p style="color: white;">${this.props.message || 'Esta acción no se puede deshacer.'}</p>
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
    this.confirmBtn = this.element.querySelector('[data-ref="confirmBtn"]');
    this.cancelBtn = this.element.querySelector('[data-ref="cancelBtn"]');
    
    if (this.confirmBtn) {
      this.confirmBtn.addEventListener('click', this.handleConfirm.bind(this));
    }
    
    if (this.cancelBtn) {
      this.cancelBtn.addEventListener('click', this.handleCancel.bind(this));
    }
    
    // Cerrar al hacer clic fuera del diálogo
    if (this.element) {
      this.element.addEventListener('click', (e) => {
        if (e.target === this.element) {
          this.hide();
        }
      });
    }
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
    this.element.style.display = 'flex';
  }

  hide() {
    this.element.style.display = 'none';
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
