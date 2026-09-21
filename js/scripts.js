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
// PASO 2: MANIPULACIÓN DINÁMICA DEL DOM (createElement, appendChild y textContent)
// ==============================================================================

/**
 * Construye de forma modular y programática la tarjeta de un videojuego en el DOM.
 * Aplica el principio de seguridad anti-XSS usando textContent para insertar textos.
 * 
 * @param {Object} prod - Objeto de datos del videojuego.
 * @returns {HTMLElement} Elemento <article> completamente ensamblado.
 */
function crearTarjetaProducto(prod) {
  // 1. Elemento contenedor <article>
  const articulo = document.createElement("article");
  articulo.classList.add("product-card");

  // 2. Contenedor multimedia <div class="card-media">
  const media = document.createElement("div");
  media.classList.add("card-media");

  // Badge promocional (ej: ⭐ Más Vendido)
  const badgePromo = document.createElement("span");
  badgePromo.classList.add("badge", "badge-featured");
  badgePromo.textContent = prod.badge || "Destacado";

  // Imagen del videojuego
  const img = document.createElement("img");
  img.src = prod.imagen.src;
  img.alt = prod.imagen.alt || `Portada de ${prod.nombre}`;
  img.classList.add("product-img");
  img.setAttribute("loading", "lazy");

  // Badge de plataforma (ej: Nintendo Switch / PS5)
  const badgePlataforma = document.createElement("span");
  badgePlataforma.classList.add("platform-tag");
  badgePlataforma.textContent = prod.plataforma || "Multiplataforma";

  media.appendChild(badgePromo);
  media.appendChild(img);
  media.appendChild(badgePlataforma);

  // 3. Cuerpo de la tarjeta <div class="product-body">
  const cuerpo = document.createElement("div");
  cuerpo.classList.add("product-body");

  // Título del juego (seguro con textContent)
  const titulo = document.createElement("h3");
  titulo.textContent = prod.nombre;

  // Género o Categoría
  const genero = document.createElement("p");
  genero.classList.add("product-genre");
  const generoStrong = document.createElement("strong");
  generoStrong.textContent = "Categoría: ";
  genero.appendChild(generoStrong);
  genero.appendChild(document.createTextNode(prod.categoria));

  // Descripción textual
  const descripcion = document.createElement("p");
  descripcion.classList.add("product-desc");
  descripcion.textContent = prod.descripcion;

  // Caja de precio y stock
  const priceBox = document.createElement("div");
  priceBox.classList.add("product-price-box");

  const priceData = document.createElement("div");
  priceData.classList.add("price-data");

  const priceLabel = document.createElement("span");
  priceLabel.classList.add("price-label");
  priceLabel.textContent = "Precio especial";

  const priceVal = document.createElement("p");
  priceVal.classList.add("product-price");
  priceVal.textContent = `$${prod.precio.toLocaleString("es-CL")} `;
  const priceCurrency = document.createElement("small");
  priceCurrency.textContent = "CLP";
  priceVal.appendChild(priceCurrency);

  priceData.appendChild(priceLabel);
  priceData.appendChild(priceVal);

  const stockBadge = document.createElement("span");
  stockBadge.classList.add("stock-badge", "stock-available");
  stockBadge.textContent = "✓ En Stock";

  priceBox.appendChild(priceData);
  priceBox.appendChild(stockBadge);

  // Botón de acción (Añadir al Carrito)
  const botonComprar = document.createElement("button");
  botonComprar.type = "button";
  botonComprar.classList.add("btn-buy");
  botonComprar.textContent = "🛒 Añadir al Carrito";

  // 4. Ensamblaje con appendChild
  cuerpo.appendChild(titulo);
  cuerpo.appendChild(genero);
  cuerpo.appendChild(descripcion);
  cuerpo.appendChild(priceBox);
  cuerpo.appendChild(botonComprar);

  articulo.appendChild(media);
  articulo.appendChild(cuerpo);

  return articulo;
}

/**
 * Renderiza la lista completa de videojuegos dentro del contenedor del DOM.
 * @param {Array<Object>} productos - Lista de videojuegos.
 */
function mostrarProductos(productos) {
  const contenedor = document.getElementById("contenedor_productos");
  if (!contenedor) return;

  // Limpiar el contenedor (elimina el spinner de carga)
  contenedor.innerHTML = "";

  // Construir e insertar programáticamente cada producto
  productos.forEach((prod) => {
    const tarjeta = crearTarjetaProducto(prod);
    contenedor.appendChild(tarjeta);
  });
}

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
      mostrarProductos(productosCatalogo);
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

// ==============================================================================
// PASO 3: GESTIÓN DE EVENTOS - EVENTO CLICK (OFERTAS ESPECIALES)
// ==============================================================================

/**
 * Configura el evento 'click' para mostrar u ocultar la sección de ofertas especiales.
 * Alterna la clase 'd-none' y actualiza el texto del botón dinámicamente.
 */
function configurarEventoOfertas() {
  const botonOfertas = document.getElementById("boton_ofertas");
  const seccionOfertas = document.getElementById("seccion_ofertas");

  if (!botonOfertas || !seccionOfertas) return;

  botonOfertas.addEventListener("click", () => {
    // Alternar visibilidad con toggle
    seccionOfertas.classList.toggle("d-none");
    const estaOculta = seccionOfertas.classList.contains("d-none");

    // Feedback dinámico en el texto del botón
    botonOfertas.textContent = estaOculta
      ? "🔥 Ver Ofertas Especiales"
      : "❌ Ocultar Ofertas";
  });
}

// ==============================================================================
// PASO 4: GESTIÓN DE EVENTOS - MOUSEOVER Y MOUSEOUT (GUÍA DINÁMICA DE USUARIO)
// ==============================================================================

/**
 * Configura los eventos 'mouseover' y 'mouseout' sobre los enlaces de navegación.
 * Modifica el texto en #lead_info dinámicamente como guía interactiva para el usuario.
 */
function configurarEventosMouseMenu() {
  const leadInfo = document.getElementById("lead_info");
  if (!leadInfo) return;

  const textoOriginal = "Explora nuestra selección especial de videojuegos recomendados con despacho prioritario en Chile.";

  const enlacesGuia = [
    { id: "menu_inicio", texto: "🎮 EriGamesStore: tu destino definitivo para títulos de PS5, Switch, Xbox y PC." },
    { id: "menu_productos", texto: "📦 Catálogo Gamer: videojuegos 100% originales con despacho express a todo Chile." },
    { id: "menu_categorias", texto: "⚔️ Explora por género: Aventura, RPG, Deportes, Plataformas y Survival Horror." },
    { id: "menu_beneficios", texto: "🛡️ Compra segura: Garantía oficial, pago cifrado SSL y asesoría de expertos." },
    { id: "menu_contacto", texto: "✉️ ¿Dudas o cotizaciones? Escríbenos y te responderemos en menos de 24 horas." }
  ];

  enlacesGuia.forEach(({ id, texto }) => {
    const elemento = document.getElementById(id);
    if (elemento) {
      elemento.addEventListener("mouseover", () => {
        leadInfo.textContent = texto;
        leadInfo.style.color = "var(--accent-cyan)";
        leadInfo.style.fontWeight = "600";
      });
      elemento.addEventListener("mouseout", () => {
        leadInfo.textContent = textoOriginal;
        leadInfo.style.color = "";
        leadInfo.style.fontWeight = "";
      });
    }
  });
}

// Punto de entrada seguro
document.addEventListener("DOMContentLoaded", () => {
  cargarProductos();
  configurarEventoOfertas();
  configurarEventosMouseMenu();
});

