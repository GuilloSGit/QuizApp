/**
 * Utilidades para manejo de rutas en la aplicación
 * Funciona tanto en desarrollo local como en producción con GitHub Pages
 */

const PathUtils = {
    /**
     * Obtiene la ruta base según el entorno
     * @returns {string} Ruta base para el entorno actual
     */
    getBasePath: () => {
        const isLocal = window.location.hostname === 'localhost' || 
                      window.location.hostname === '127.0.0.1';
        return isLocal ? '' : '/QuizApp';
    },

    /**
     * Genera una ruta absoluta relativa a la raíz del sitio
     * @param {string} path - Ruta relativa (ej: 'views/pages/end.html')
     * @returns {string} Ruta absoluta completa
     */
    getAbsolutePath: (path) => {
        const basePath = PathUtils.getBasePath();
        // Aseguramos que no haya dobles barras
        return `${basePath}/${path}`.replace(/([^:]\/)\/+/g, '$1');
    },

    /**
     * Redirige a una ruta específica
     * @param {string} path - Ruta relativa a la que redirigir
     */
    navigateTo: (path) => {
        window.location.href = PathUtils.getAbsolutePath(path);
    },

    /**
     * Obtiene la URL de un recurso (imágenes, datos, etc.)
     * @param {string} type - Tipo de recurso ('images', 'data', 'css', 'js')
     * @param {string} filename - Nombre del archivo
     * @returns {string} Ruta completa al recurso
     */
    getResourceUrl: (type, filename) => {
        const paths = {
            'images': 'assets/images',
            'data': 'assets/data',
            'css': 'assets/css',
            'js': 'assets/js'
        };
        
        if (!paths[type]) {
            console.warn(`Tipo de recurso no reconocido: ${type}`);
            return filename;
        }
        
        return PathUtils.getAbsolutePath(`${paths[type]}/${filename}`);
    }
};

// Hacerlo accesible globalmente si es necesario
if (window) {
    window.PathUtils = PathUtils;
}

export default PathUtils;
