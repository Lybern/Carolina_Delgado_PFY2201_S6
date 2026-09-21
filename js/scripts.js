/**
 * ==============================================================================
 * ERIGAMESSTORE - LÓGICA DE JAVASCRIPT MODULAR (ES6+)
 * Asignatura: Desarrollo Frontend I (PFY2201)
 * Estudiante: Carolina Delgado | Duoc UC
 * ==============================================================================
 */

// ==============================================================================
// 1. ESTADO GLOBAL DE LA APLICACIÓN
// ==============================================================================

/**
 * Catálogo general de videojuegos obtenidos asincrónicamente.
 * @type {Array<Object>}
 */
let productosCatalogo = [];

/**
 * Contador de reintentos para la solicitud asíncrona de datos.
 * @type {number}
 */
let intentosCarga = 0;

/**
 * Límite máximo de reintentos permitidos para la solicitud Fetch.
 * @constant {number}
 */
const MAX_INTENTOS_FETCH = 3;

/**
 * Tiempo límite en milisegundos para abortar solicitudes lentas.
 * @constant {number}
 */
const TIMEOUT_FETCH_MS = 7000;

// ==============================================================================
// 2. UTILIDADES Y FUNCIONES REUTILIZABLES (HELPERS)
// ==============================================================================

/**
 * Formatea un valor numérico a moneda local chilena (CLP).
 * Centraliza la presentación uniforme de precios en toda la interfaz.
 * 
 * @param {number|string} precio - Monto numérico a formatear.
 * @returns {string} Cadena formateada (ej: "$54.990 CLP").
 */
function formatearPrecioCLP(precio) {
  return `$${Number(precio).toLocaleString("es-CL")} CLP`;
}

/**
 * Genera un nodo de insignia (badge) configurado de manera programática y segura.
 * 
 * @param {string} texto - Contenido textual de la insignia.
 * @param {string} claseColor - Clase CSS contextual para el diseño visual.
 * @returns {HTMLSpanElement} Elemento <span> ensamblado.
 */
function crearBadge(texto, claseColor = "badge-featured") {
  const badge = document.createElement("span");
  badge.classList.add("badge", claseColor);
  badge.textContent = texto; // Protección anti-XSS
  return badge;
}

/**
 * Crea un elemento HTML con asignación de contenido textual y clases CSS en un solo paso.
 * 
 * @param {string} etiqueta - Nombre de la etiqueta HTML (ej: 'h3', 'p', 'span').
 * @param {string} [texto=""] - Contenido textual asignado mediante textContent.
 * @param {...string} clases - Clases CSS aplicadas al elemento.
 * @returns {HTMLElement} Elemento DOM configurado.
 */
function crearNodoTexto(etiqueta, texto = "", ...clases) {
  const nodo = document.createElement(etiqueta);
  if (texto) {
    nodo.textContent = texto;
  }
  if (clases.length > 0) {
    nodo.classList.add(...clases);
  }
  return nodo;
}

// ==============================================================================
// 3. MANIPULACIÓN DINÁMICA DEL DOM (createElement y appendChild)
// ==============================================================================

/**
 * Construye de forma modular la tarjeta de un videojuego en el DOM.
 * Utiliza utilidades centralizadas y asegura la protección de datos con textContent.
 * 
 * @param {Object} prod - Datos del videojuego desde el archivo JSON.
 * @returns {HTMLElement} Elemento <article> ensamblado.
 */
function crearTarjetaProducto(prod) {
  const articulo = document.createElement("article");
  articulo.classList.add("product-card");

  // 1. Contenedor multimedia <div class="card-media">
  const media = document.createElement("div");
  media.classList.add("card-media");

  const badgePromo = crearBadge(prod.badge || "Destacado", "badge-featured");
  const badgePlataforma = crearBadge(prod.plataforma || "Multiplataforma", "platform-tag");

  const img = document.createElement("img");
  img.src = prod.imagen.src;
  img.alt = prod.imagen.alt || `Portada de ${prod.nombre}`;
  img.classList.add("product-img");
  img.setAttribute("loading", "lazy");

  media.appendChild(badgePromo);
  media.appendChild(img);
  media.appendChild(badgePlataforma);

  // 2. Cuerpo de la tarjeta <div class="product-body">
  const cuerpo = document.createElement("div");
  cuerpo.classList.add("product-body");

  const titulo = crearNodoTexto("h3", prod.nombre);

  const genero = document.createElement("p");
  genero.classList.add("product-genre");
  const generoLabel = crearNodoTexto("strong", "Categoría: ");
  genero.appendChild(generoLabel);
  genero.appendChild(document.createTextNode(prod.categoria));

  const descripcion = crearNodoTexto("p", prod.descripcion, "product-desc");

  // Caja de precio y stock
  const priceBox = document.createElement("div");
  priceBox.classList.add("product-price-box");

  const priceData = document.createElement("div");
  priceData.classList.add("price-data");

  const priceLabel = crearNodoTexto("span", "Precio especial", "price-label");
  const priceVal = crearNodoTexto("p", formatearPrecioCLP(prod.precio), "product-price");

  priceData.appendChild(priceLabel);
  priceData.appendChild(priceVal);

  const stockBadge = crearNodoTexto("span", "✓ En Stock", "stock-badge", "stock-available");

  priceBox.appendChild(priceData);
  priceBox.appendChild(stockBadge);

  // Botón de acción con microinteracción visual
  const botonComprar = document.createElement("button");
  botonComprar.type = "button";
  botonComprar.classList.add("btn-buy");
  botonComprar.textContent = "🛒 Añadir al Carrito";

  botonComprar.addEventListener("click", () => {
    const textoPrevio = botonComprar.textContent;
    botonComprar.textContent = "✅ ¡Añadido!";
    botonComprar.style.backgroundColor = "var(--accent-green)";
    botonComprar.style.borderColor = "var(--accent-green)";
    botonComprar.style.color = "#ffffff";

    setTimeout(() => {
      botonComprar.textContent = textoPrevio;
      botonComprar.style.backgroundColor = "";
      botonComprar.style.borderColor = "";
      botonComprar.style.color = "";
    }, 1500);
  });

  // Ensamblaje ordenado con appendChild
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
 * Renderiza el conjunto de videojuegos en el contenedor principal del DOM.
 * @param {Array<Object>} productos - Arreglo de videojuegos a desplegar.
 */
function mostrarProductos(productos) {
  const contenedor = document.getElementById("contenedor_productos");
  if (!contenedor) return;

  contenedor.innerHTML = "";

  productos.forEach((prod) => {
    const tarjeta = crearTarjetaProducto(prod);
    contenedor.appendChild(tarjeta);
  });
}

// ==============================================================================
// 4. CONSUMO ASÍNCRONO CON FETCH API (TIMEOUTS Y REINTENTOS CONTROLADOS)
// ==============================================================================

/**
 * Carga el catálogo de productos con control de tiempo de espera y reintentos limitados.
 * Utiliza AbortController para prevenir solicitudes colgadas y despliega orientación interactiva.
 */
function cargarProductos() {
  const contenedor = document.getElementById("contenedor_productos");
  if (!contenedor) return;

  intentosCarga++;

  // Indicador de carga con retroalimentación del intento actual
  contenedor.innerHTML = `
    <div class="spinner-caja" id="spinner_carga" style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem;">
      <div class="spinner-gamer" role="status" aria-label="Cargando catálogo"></div>
      <p style="color: var(--text-muted); margin-top: 1rem; font-weight: 600;">
        Cargando catálogo oficial de videojuegos... (Intento ${intentosCarga} de ${MAX_INTENTOS_FETCH})
      </p>
    </div>
  `;

  // Configuración de AbortController para control de timeout
  const controlador = new AbortController();
  const temporizadorId = setTimeout(() => {
    controlador.abort();
  }, TIMEOUT_FETCH_MS);

  fetch("data/productos.json", { signal: controlador.signal })
    .then((respuesta) => {
      clearTimeout(temporizadorId);
      if (!respuesta.ok) {
        throw new Error(`Error HTTP: ${respuesta.status}`);
      }
      return respuesta.json();
    })
    .then((datos) => {
      intentosCarga = 0; // Restablecer contador tras éxito
      productosCatalogo = datos;
      console.log(`Catálogo cargado exitosamente: ${datos.length} títulos listos.`);
      mostrarProductos(productosCatalogo);
    })
    .catch((error) => {
      clearTimeout(temporizadorId);
      console.error("Fallo en la carga de datos:", error);

      const esTimeout = error.name === "AbortError";
      const mensajeDetalle = esTimeout
        ? "El servidor superó el tiempo máximo de espera sin responder."
        : "No fue posible acceder al archivo de datos 'data/productos.json'.";

      // Botón interactivo de reintento si no se ha alcanzado el límite
      const accionReintento = intentosCarga < MAX_INTENTOS_FETCH
        ? `<button type="button" class="btn btn-primary" onclick="cargarProductos()" style="margin-top: 1rem; font-weight: bold; cursor: pointer; padding: 0.6rem 1.4rem; border-radius: var(--radius-sm); border: none; background: var(--accent-blue); color: #ffffff;">
             🔄 Reintentar Carga (${intentosCarga}/${MAX_INTENTOS_FETCH})
           </button>`
        : `<p style="color: var(--text-muted); font-size: 0.88rem; margin-top: 0.75rem;">
             Límite de ${MAX_INTENTOS_FETCH} intentos alcanzado. Inicia un servidor local (Live Server o python -m http.server).
           </p>`;

      contenedor.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 2.5rem; background: var(--bg-card); border: 1px solid var(--accent-red); border-radius: var(--radius-md);">
          <p style="font-size: 2rem; margin-bottom: 0.5rem;">⚠️</p>
          <h4 style="color: var(--accent-red); margin-bottom: 0.5rem; font-size: 1.25rem;">No se pudo cargar el catálogo</h4>
          <p style="color: var(--text-secondary); max-width: 600px; margin: 0 auto; font-size: 0.95rem;">${mensajeDetalle}</p>
          ${accionReintento}
        </div>
      `;
    });
}

// ==============================================================================
// 5. GESTIÓN DE EVENTOS E INTERACTIVIDAD
// ==============================================================================

/**
 * Configura el evento 'click' para alternar la visibilidad del bloque de ofertas.
 */
function configurarEventoOfertas() {
  const botonOfertas = document.getElementById("boton_ofertas");
  const seccionOfertas = document.getElementById("seccion_ofertas");

  if (!botonOfertas || !seccionOfertas) return;

  botonOfertas.addEventListener("click", () => {
    seccionOfertas.classList.toggle("d-none");
    const estaOculta = seccionOfertas.classList.contains("d-none");

    botonOfertas.textContent = estaOculta
      ? "🔥 Ver Ofertas Especiales"
      : "❌ Ocultar Ofertas";
  });
}

/**
 * Configura eventos 'mouseover' y 'mouseout' en los enlaces del menú para orientar al usuario.
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

/**
 * Valida el formulario de contacto mediante expresiones regulares y retroalimentación inline.
 * Intercepta el envío con preventDefault() y posiciona el foco en el primer campo inválido.
 */
function configurarEventoSubmitFormulario() {
  const formContacto = document.getElementById("form_contacto");
  const cajaMensaje = document.getElementById("mensaje_estado");

  if (!formContacto || !cajaMensaje) return;

  /**
   * Muestra o limpia la retroalimentación visual inline en un campo específico.
   * @param {string} inputId - Identificador del campo input/select/textarea.
   * @param {string} errorId - Identificador del elemento de error inline.
   * @param {string|null} mensajeError - Mensaje a desplegar, o null si es válido.
   */
  function actualizarEstadoCampo(inputId, errorId, mensajeError) {
    const input = document.getElementById(inputId);
    const spanError = document.getElementById(errorId);
    if (!input || !spanError) return;

    if (mensajeError) {
      spanError.textContent = mensajeError;
      spanError.style.display = "block";
      input.style.borderColor = "var(--accent-red)";
    } else {
      spanError.textContent = "";
      spanError.style.display = "none";
      input.style.borderColor = "var(--accent-green)";
    }
  }

  formContacto.addEventListener("submit", (evento) => {
    evento.preventDefault(); // Detener recarga por defecto

    const inputNombre = document.getElementById("nombre");
    const inputEmail = document.getElementById("email");
    const selectMotivo = document.getElementById("motivo");
    const inputMensaje = document.getElementById("mensaje");

    let primerCampoInvalido = null;

    // 1. Validación de nombre con expresión regular (alfabético, tildes, mínimo 3 caracteres)
    const regexNombre = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{3,50}$/;
    if (!regexNombre.test(inputNombre.value.trim())) {
      actualizarEstadoCampo("nombre", "error_nombre", "Ingresa tu nombre (mínimo 3 letras, sin números ni símbolos).");
      if (!primerCampoInvalido) primerCampoInvalido = inputNombre;
    } else {
      actualizarEstadoCampo("nombre", "error_nombre", null);
    }

    // 2. Validación de correo con expresión regular robusta (usuario@dominio.extension)
    const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!regexEmail.test(inputEmail.value.trim())) {
      actualizarEstadoCampo("email", "error_email", "Ingresa un correo electrónico válido (ejemplo: usuario@correo.com).");
      if (!primerCampoInvalido) primerCampoInvalido = inputEmail;
    } else {
      actualizarEstadoCampo("email", "error_email", null);
    }

    // 3. Validación de selección de motivo
    if (selectMotivo.value === "") {
      actualizarEstadoCampo("motivo", "error_motivo", "Selecciona una opción de la lista.");
      if (!primerCampoInvalido) primerCampoInvalido = selectMotivo;
    } else {
      actualizarEstadoCampo("motivo", "error_motivo", null);
    }

    // 4. Validación de mensaje (mínimo 10 caracteres)
    if (inputMensaje.value.trim().length < 10) {
      actualizarEstadoCampo("mensaje", "error_mensaje", "El mensaje debe contener al menos 10 caracteres explicativos.");
      if (!primerCampoInvalido) primerCampoInvalido = inputMensaje;
    } else {
      actualizarEstadoCampo("mensaje", "error_mensaje", null);
    }

    // 5. Direccionamiento automático del foco hacia el primer campo erróneo
    if (primerCampoInvalido) {
      primerCampoInvalido.focus();
      return;
    }

    // Despliegue de mensaje de éxito en el DOM
    cajaMensaje.style.display = "block";
    cajaMensaje.style.backgroundColor = "rgba(16, 185, 129, 0.15)";
    cajaMensaje.style.border = "1px solid var(--accent-green)";
    cajaMensaje.style.color = "#ffffff";
    cajaMensaje.textContent = `✅ ¡Mensaje enviado con éxito, ${inputNombre.value.trim()}! Te responderemos a ${inputEmail.value.trim()} a la brevedad.`;

    formContacto.reset();

    // Restablecer estilos de bordes
    [inputNombre, inputEmail, selectMotivo, inputMensaje].forEach((el) => {
      el.style.borderColor = "";
    });

    setTimeout(() => {
      cajaMensaje.style.display = "none";
    }, 6000);
  });
}

// ==============================================================================
// 6. TEMPORIZADORES ASINCRÓNICOS
// ==============================================================================

/**
 * Restablece los estilos aplicados dinámicamente eliminando propiedades en línea.
 */
function reestablecerColores() {
  const enlacesMenu = document.querySelectorAll(".nav-link");
  enlacesMenu.forEach((el) => {
    el.style.color = "";
    el.style.removeProperty("color");
  });
}

// ==============================================================================
// 7. PUNTO DE ENTRADA SEGURO (DOMContentLoaded)
// ==============================================================================

document.addEventListener("DOMContentLoaded", () => {
  console.log("El DOM está listo para ser manipulado con total seguridad.");

  // Resalta los enlaces del menú temporalmente y los restaura tras 3 segundos
  const enlacesMenu = document.querySelectorAll(".nav-link");
  enlacesMenu.forEach((el) => {
    el.style.setProperty("color", "#00f0ff", "important");
  });
  setTimeout(reestablecerColores, 3000);

  // Inicialización de módulos
  cargarProductos();
  configurarEventoOfertas();
  configurarEventosMouseMenu();
  configurarEventoSubmitFormulario();
});
