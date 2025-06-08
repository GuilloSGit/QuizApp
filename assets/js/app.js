import { Component } from './components/Component.js';
import BackButton from './components/BackButton.js';
import ConfirmDialog from './components/ConfirmDialog.js';

window.Component = Component;
window.BackButton = BackButton;
window.ConfirmDialog = ConfirmDialog;

function initApp() {
  try {
    initComponents();
  } catch (error) {
    console.error('Error al inicializar la aplicación:', error);
  }
}

function initComponents() {
  const backButtons = document.querySelectorAll('[data-component="back-button"]');
  backButtons.forEach((button, index) => {
    try {
      const backButton = new BackButton(button, {
        onClick: () => {
          const href = button.dataset.href || '/index.html';
          window.location.href = href;
        }
      });
      backButton.mount();
    } catch (error) {
      console.error(`Error al inicializar botón de volver #${index + 1}:`, error);
    }
  });
  
  const confirmDialogs = document.querySelectorAll('[data-component="confirm-dialog"]');
  
  confirmDialogs.forEach((dialog, index) => {
    try {
      const confirmDialog = new ConfirmDialog(dialog, {
        id: dialog.id || 'confirmDialog',
        title: dialog.dataset.title || '¿Estás seguro?',
        message: dialog.dataset.message || '¿Deseas continuar?',
        confirmText: dialog.dataset.confirmText || 'Aceptar',
        cancelText: dialog.dataset.cancelText || 'Cancelar',
        onConfirm: () => {
          if (dialog.dataset.confirmAction === 'navigate' && dialog.dataset.href) {
            window.location.href = dialog.dataset.href;
          } else if (typeof window[dialog.dataset.confirmAction] === 'function') {
            window[dialog.dataset.confirmAction]();
          }
        },
        onCancel: () => {
          if (typeof window[dialog.dataset.cancelAction] === 'function') {
            window[dialog.dataset.cancelAction]();
          }
        }
      });
      confirmDialog.mount();
    } catch (error) {
      console.error(`Error al inicializar diálogo de confirmación #${index + 1}:`, error);
    }
  });
}

window.initApp = initApp;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initApp();
  });
} else {
  initApp();
}
