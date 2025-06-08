// Importar los componentes para asegurar que se registren globalmente
import './components/Component.js';
import './components/BackButton.js';
import './components/ConfirmDialog.js';

// Inicializar la aplicación
function initApp() {
  try {
    // Inicializar componentes globales
    initComponents();
    console.log('Aplicación inicializada correctamente');
  } catch (error) {
    console.error('Error al inicializar la aplicación:', error);
  }
}

// Inicializar componentes
function initComponents() {
  try {
    // Inicializar botones de volver
    const backButtons = document.querySelectorAll('[data-component="back-button"]');
    console.log(`Encontrados ${backButtons.length} botones de volver`);
    
    backButtons.forEach(button => {
      try {
        const backButton = new window.BackButton(button, {
          onClick: () => {
            const href = button.dataset.href || '/index.html';
            console.log('Navegando a:', href);
            window.location.href = href;
          }
        });
        backButton.mount();
      } catch (error) {
        console.error('Error al inicializar botón de volver:', error);
      }
    });
    
    // Inicializar diálogos de confirmación
    const confirmDialogs = document.querySelectorAll('[data-component="confirm-dialog"]');
    console.log(`Encontrados ${confirmDialogs.length} diálogos de confirmación`);
    
    confirmDialogs.forEach(dialog => {
      try {
        const confirmDialog = new window.ConfirmDialog(dialog, {
          id: dialog.id || 'confirmDialog',
          title: dialog.dataset.title || '¿Estás seguro?',
          message: dialog.dataset.message || '¿Deseas continuar?',
          confirmText: dialog.dataset.confirmText || 'Aceptar',
          cancelText: dialog.dataset.cancelText || 'Cancelar',
          onConfirm: () => {
            console.log('Confirmado:', dialog.dataset.confirmAction);
            if (dialog.dataset.confirmAction === 'navigate' && dialog.dataset.href) {
              window.location.href = dialog.dataset.href;
            } else if (typeof window[dialog.dataset.confirmAction] === 'function') {
              window[dialog.dataset.confirmAction]();
            }
          },
          onCancel: () => {
            console.log('Cancelado');
            if (typeof window[dialog.dataset.cancelAction] === 'function') {
              window[dialog.dataset.cancelAction]();
            }
          }
        });
        confirmDialog.mount();
      } catch (error) {
        console.error('Error al inicializar diálogo de confirmación:', error);
      }
    });
  } catch (error) {
    console.error('Error en initComponents:', error);
  }
}

// Esperar a que el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM completamente cargado');
  initApp();
});

// Inicializar inmediatamente si el DOM ya está listo
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  initApp();
}

// Hacer que las funciones estén disponibles globalmente
window.initApp = initApp;
