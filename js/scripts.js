/**
 * ==============================================================================
 * ERIGAMESSTORE - LÓGICA DE JAVASCRIPT (ES6+)
 * Asignatura: Desarrollo Frontend I (PFY2201)
 * Estudiante: Carolina Delgado | Duoc UC
 * ==============================================================================
 */

// ==============================================================================
// 1. ESTADO GLOBAL
// ==============================================================================
let productosCatalogo = [];

// ==============================================================================
// PASO 1: CONSUMO ASÍNCRONO CON FETCH API Y PROMESAS
// ==============================================================================

/**
 * Carga el catálogo de productos desde un archivo JSON local utilizando Fetch API.
 * Gestiona el ciclo de vida de promesas con .then() y .catch(), mostrando un spinner mientras espera.
 */
function cargarProductos() {
  const contenedor = document.getElementById("contenedor_productos");
  if (!contenedor) return;

  // Mostrar indicador visual de carga (Spinner)
  contenedor.innerHTML = `
    <div class="spinner-caja" id="spinner_carga" style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem;">
      <div class="spinner-gamer" role="status" aria-label="Cargando catálogo"></div>
      <p style="color: var(--text-muted); margin-top: 1rem; font-weight: 600;">Cargando catálogo oficial de videojuegos...</p>
    </div>
  `;

  // Solicitud asíncrona con Fetch API
  fetch("data/productos.json")
    .then((respuesta) => {
      // Validación del estado de la respuesta HTTP
      if (!respuesta.ok) {
        throw new Error(`Error en el servidor: HTTP ${respuesta.status}`);
      }
      return respuesta.json(); // Convierte texto a objeto JSON
    })
    .then((datos) => {
      productosCatalogo = datos;
      console.log(`Catálogo cargado con éxito: ${datos.length} videojuegos listos.`);
      // En el Paso 2 conectamos la construcción de tarjetas con createElement
      if (typeof mostrarProductos === "function") {
        mostrarProductos(productosCatalogo);
      }
    })
    .catch((error) => {
      // Manejo amigable de errores en la interfaz de usuario
      console.error("Error al cargar productos con Fetch API:", error);
      contenedor.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
          <p style="color: var(--accent-red); font-weight: bold; font-size: 1.1rem;">⚠️ No se pudo cargar el catálogo de videojuegos.</p>
          <p style="color: var(--text-muted); font-size: 0.9rem;">Por favor, revisa la conexión o ejecuta el sitio desde un servidor local.</p>
        </div>
      `;
    });
}

// Punto de entrada seguro
document.addEventListener("DOMContentLoaded", () => {
  cargarProductos();
});
