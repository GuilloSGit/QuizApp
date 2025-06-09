/**
 * Configuración centralizada de rutas para la aplicación
 * Esto asegura que todas las rutas sean consistentes en toda la aplicación
 */

const isLocal = window.location.hostname === 'localhost' || 
               window.location.hostname === '127.0.0.1';
const basePath = isLocal ? '' : '/QuizApp';

const routes = {
  // Páginas principales
  home: '/',
  game: '/views/pages/game.html',
  highscores: '/views/pages/highscores.html',
  end: '/views/pages/end.html',
  
  // Recursos
  assets: {
    images: '/assets/images',
    css: '/assets/css',
    js: '/assets/js',
    data: '/assets/data'
  },
  
  // Utilidades
  utils: {
    pathUtils: '/assets/js/utils/pathUtils.js'
  },
  
  // Obtener la ruta completa para un recurso
  get: function(path) {
    // Si la ruta ya es absoluta, devolverla tal cual
    if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('/')) {
      return path;
    }
    
    // Para rutas relativas, agregar el basePath si es necesario
    return `${basePath}${path.startsWith('/') ? '' : '/'}${path}`;
  },
  
  // Navegar a una ruta
  navigateTo: function(path) {
    window.location.href = this.get(path);
  },
  
  // Obtener la URL de un recurso
  getAsset: function(type, filename) {
    const assetPath = this.assets[type];
    if (!assetPath) {
      console.warn(`Tipo de recurso no reconocido: ${type}`);
      return filename;
    }
    return this.get(`${assetPath}/${filename}`);
  }
};

// Hacerlo accesible globalmente
if (window) {
  window.AppRoutes = routes;
}

export default routes;
