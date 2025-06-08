/**
 * Clase base para componentes
 */
class Component {
  /**
   * Crea una instancia del componente
   * @param {HTMLElement} element - Elemento raíz del componente
   * @param {Object} props - Propiedades del componente
   */
  constructor(element, props = {}) {
    this.element = element;
    this.props = props;
    this.state = {};
    this.children = [];
    this.isMounted = false;
  }

  /**
   * Método para renderizar el componente
   * Debe ser implementado por las clases hijas
   */
  render() {
    throw new Error('El método render debe ser implementado por las clases hijas');
  }

  /**
   * Método llamado después de que el componente se monta en el DOM
   */
  componentDidMount() {}

  /**
   * Método llamado después de que el componente se actualiza
   */
  componentDidUpdate() {}

  /**
   * Método para actualizar el estado del componente
   * @param {Object} newState - Nuevo estado
   */
  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.update();
  }

  /**
   * Actualiza el componente
   */
  update() {
    if (!this.isMounted) return;
    
    // Guardar referencias a los elementos con data-ref
    const refs = {};
    this.element.querySelectorAll('[data-ref]').forEach(el => {
      refs[el.dataset.ref] = el;
    });

    // Renderizar el componente
    const newContent = this.render();
    if (typeof newContent === 'string') {
      this.element.innerHTML = newContent;
    }

    // Restaurar referencias
    Object.entries(refs).forEach(([ref, element]) => {
      const newElement = this.element.querySelector(`[data-ref="${ref}"]`);
      if (newElement) {
        newElement._component = element._component;
      }
    });

    this.componentDidUpdate();
  }

  /**
   * Monta el componente en el DOM
   */
  mount() {
    if (!this.element) {
      console.error('No se puede montar el componente: elemento no encontrado');
      return this;
    }

    try {
      // Guardar el contenido original para referencia
      const originalContent = this.element.innerHTML.trim();
      
      // Renderizar el componente
      const renderedContent = this.render();
      
      // Solo actualizar el contenido si es necesario
      if (renderedContent !== undefined && renderedContent !== null) {
        this.element.innerHTML = renderedContent;
      }
      
      this.isMounted = true;
      
      // Llamar al hook de ciclo de vida
      this.componentDidMount();
    } catch (error) {
      console.error('Error al montar el componente:', this.constructor.name, error);
    }
    
    return this;
  }

  /**
   * Desmonta el componente del DOM
   */
  unmount() {
    if (!this.isMounted) return;
    
    this.isMounted = false;
    if (this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }
}

/**
 * Función para crear un componente
 * @param {string} selector - Selector CSS del elemento raíz
 * @param {Function} componentClass - Clase del componente
 * @param {Object} props - Propiedades del componente
 * @returns {Component} Instancia del componente
 */
function createComponent(selector, componentClass, props = {}) {
  const elements = document.querySelectorAll(selector);
  return Array.from(elements).map(element => {
    const component = new componentClass(element, props);
    component.mount();
    return component;
  });
}

// Hacer que Component esté disponible globalmente
if (window) {
  window.Component = Component;
  window.createComponent = createComponent;
}

export { Component, createComponent };
