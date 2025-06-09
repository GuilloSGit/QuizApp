/**
 * Componente de diálogo de confirmación personalizado
 */
class ConfirmDialog extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._handleConfirm = this._handleConfirm.bind(this);
    this._handleCancel = this._handleCancel.bind(this);
    this._handleKeyDown = this._handleKeyDown.bind(this);
  }
  static get observedAttributes() {
    return ['title', 'message', 'confirm-text', 'cancel-text', 'open'];
  }

  connectedCallback() {
    this._render();
    this._setupEventListeners();
  }

  disconnectedCallback() {
    this._removeEventListeners();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this._render();
    }
  }

  _render() {
    const title = this.getAttribute('title') || '¿Estás seguro?';
    const message = this.getAttribute('message') || '¿Deseas continuar?';
    const confirmText = this.getAttribute('confirm-text') || 'Aceptar';
    const cancelText = this.getAttribute('cancel-text') || 'Cancelar';
    const isOpen = this.hasAttribute('open');

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          z-index: 1000;
          justify-content: center;
          align-items: center;
        }
        :host([open]) {
          display: flex;
        }
        .modal-content {
          background: white;
          padding: 20px;
          border-radius: 8px;
          max-width: 90%;
          width: 400px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        h4 {
          color: #000;
          font-size: 1.2rem;
          margin-top: 0;
        }
        p {
          color: #000;
          font-size: 1rem;
          margin: 1rem 0;
        }
        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 20px;
        }
        .btn {
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.9rem;
          transition: background-color 0.2s;
        }
        .btn-cancel {
          background-color: #e0e0e0;
        }
        .btn-cancel:hover {
          background-color: #d0d0d0;
        }
        .btn-confirm {
          background-color: #e74c3c;
          color: white;
        }
        .btn-confirm:hover {
          background-color: #c0392b;
        }
      </style>
      <div class="modal-content">
        <h4>${title}</h4>
        <p>${message}</p>
        <div class="modal-actions">
          <button class="btn btn-cancel" data-ref="cancelBtn">
            ${cancelText}
          </button>
          <button class="btn btn-confirm" data-ref="confirmBtn">
            ${confirmText}
          </button>
        </div>
      </div>
    `;

    this._setupEventListeners();
  }

  _setupEventListeners() {
    this._removeEventListeners();
    
    this.confirmBtn = this.shadowRoot.querySelector('[data-ref="confirmBtn"]');
    this.cancelBtn = this.shadowRoot.querySelector('[data-ref="cancelBtn"]');
    
    if (this.confirmBtn) {
      this.confirmBtn.addEventListener('click', this._handleConfirm);
    }
    
    if (this.cancelBtn) {
      this.cancelBtn.addEventListener('click', this._handleCancel);
    }
  }
  
  _removeEventListeners() {
    if (this.confirmBtn) {
      this.confirmBtn.removeEventListener('click', this._handleConfirm);
    }
    
    if (this.cancelBtn) {
      this.cancelBtn.removeEventListener('click', this._handleCancel);
    }
  }

  _handleConfirm() {
    this.dispatchEvent(new CustomEvent('confirm'));
    this.close();
  }

  _handleCancel() {
    this.dispatchEvent(new CustomEvent('cancel'));
    this.close();
  }

  _handleKeyDown(event) {
    if (event.key === 'Escape') {
      this.close();
    }
  }

  open() {
    this.setAttribute('open', '');
    document.body.style.overflow = 'hidden';
    
    if (this.cancelBtn) {
      setTimeout(() => {
        this.cancelBtn.focus();
      }, 100);
    }
    
    document.addEventListener('keydown', this._handleKeyDown);
  }

  close() {
    this.removeAttribute('open');
    document.body.style.overflow = '';
    
    document.removeEventListener('keydown', this._handleKeyDown);
  }

  hide() {
    this.close();
  }

  show() {
    this.open();
  }
  
  confirm() {
    this._handleConfirm();
  }
  cancel() {
    this._handleCancel();
  }

  // Métodos de compatibilidad
  handleConfirm() {
    this._handleConfirm();
  }

  handleCancel() {
    this._handleCancel();
  }
}

if (!customElements.get('confirm-dialog')) {
  customElements.define('confirm-dialog', ConfirmDialog);
}
