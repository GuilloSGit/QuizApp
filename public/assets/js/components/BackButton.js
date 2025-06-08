/**
 * Componente de botón de volver
 */
class BackButton extends window.Component {
  render() {
    return `
      <button class="btn leave-game" data-ref="button">
        <img src="/public/assets/images/back.svg" alt="Volver">
        Volver
      </button>
    `;
  }

  componentDidMount() {
    this.button = this.element.querySelector('[data-ref="button"]');
    if (this.button) {
      this.button.addEventListener('click', this.handleClick.bind(this));
    }
  }

  componentWillUnmount() {
    if (this.button) {
      this.button.removeEventListener('click', this.handleClick);
    }
  }

  handleClick(e) {
    e.preventDefault();
    if (typeof this.props.onClick === 'function') {
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
