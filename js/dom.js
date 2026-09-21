/**
 * ==============================================================================
 * ARCHIVO: js/dom.js
 * ASIGNATURA: Desarrollo Frontend I (PFY2201) - Semana 6
 * ALUMNA: Carolina Delgado
 * DESCRIPCIÓN: Módulo responsable de la carga asíncrona mediante Fetch API,
 *              la construcción y manipulación dinámica del DOM en el catálogo
 *              de videojuegos, gestión de eventos de búsqueda y filtros, y
 *              notificaciones amigables con Toasts de Bootstrap 5.
 * ==============================================================================
 */

"use strict";

// ==============================================================================
// 1. DATOS DE RESPALDO (FALLBACK RESILIENTE)
// ==============================================================================
const PRODUCTOS_DEFAULT = [
  {
    id: 1,
    nombre: "The Legend of Zelda: Tears of the Kingdom",
    precio: 59990,
    categoria: "Aventura y Acción",
    plataforma: "Nintendo Switch",
    badge: "Más Vendido",
    badgeClase: "badge-goty",
    badgeColor: "primary",
    descripcion: "Una épica aventura a través de la tierra y los cielos de Hyrule. Crea tus propias armas y vehículos.",
    imagen: {
      src: "img/zelda-totk.jpg",
      alt: "Portada oficial del videojuego The Legend of Zelda: Tears of the Kingdom"
    }
  },
  {
    id: 2,
    nombre: "Cyberpunk 2077: Phantom Liberty",
    precio: 29990,
    categoria: "RPG",
    plataforma: "PC / PS5 / Xbox Series",
    badge: "Expansión Top",
    badgeClase: "badge-special",
    badgeColor: "danger",
    descripcion: "Sumérgete en el oscuro distrito de Dogtown con una trepidante trama de espionaje y acción futurista.",
    imagen: {
      src: "img/cyberpunk-2077.jpg",
      alt: "Arte promocional de Cyberpunk 2077 Phantom Liberty"
    }
  },
  {
    id: 3,
    nombre: "Super Mario Bros. Wonder",
    precio: 54990,
    categoria: "Plataformas",
    plataforma: "Nintendo Switch",
    badge: "Novedad",
    badgeClase: "badge-featured",
    badgeColor: "warning",
    descripcion: "Descubre la magia del Reino Flor con efectos sorpresa, transformaciones inéditas y diversión multijugador.",
    imagen: {
      src: "img/mario-wonder.jpg",
      alt: "Carátula oficial de Super Mario Bros Wonder para Nintendo Switch"
    }
  },
  {
    id: 4,
    nombre: "EA Sports FC 24",
    precio: 49990,
    categoria: "Deportes",
    plataforma: "Multiplataforma",
    badge: "Éxito Mundial",
    badgeClase: "badge-popular",
    badgeColor: "info",
    descripcion: "La experiencia futbolística más auténtica con tecnología HyperMotionV y más de 19.000 futbolistas licenciados.",
    imagen: {
      src: "img/fc24.jpg",
      alt: "Portada deportiva de EA Sports FC 24"
    }
  },
  {
    id: 5,
    nombre: "Final Fantasy VII Rebirth",
    precio: 64990,
    categoria: "RPG",
    plataforma: "PlayStation 5",
    badge: "Imperdible",
    badgeClase: "badge-goty",
    badgeColor: "primary",
    descripcion: "Continúa el viaje fuera de Midgar en un vasto mundo repleto de historias cautivadoras y combate dinámico.",
    imagen: {
      src: "img/ffvii-rebirth.jpg",
      alt: "Portada épica de Final Fantasy VII Rebirth para PS5"
    }
  },
  {
    id: 6,
    nombre: "Resident Evil 4 Remake",
    precio: 39990,
    categoria: "Survival Horror",
    plataforma: "PC / PS5 / Xbox Series",
    badge: "Aclamado",
    badgeClase: "badge-horror",
    badgeColor: "dark",
    descripcion: "Sobrevive a la pesadilla en un apartado pueblo europeo con jugabilidad modernizada y gráficos de última generación.",
    imagen: {
      src: "img/resident-evil-4.jpg",
      alt: "Portada cinematográfica de Resident Evil 4 Remake"
    }
  }
];

// Estado global de productos cargados
let productosCatalogo = [];

// ==============================================================================
// 2. UTILIDADES DE FORMATO Y NOTIFICACIONES (TOASTS)
// ==============================================================================

/**
 * Formatea un valor numérico a moneda local Peso Chileno (CLP).
 * @param {number} monto
 * @returns {string} Ejemplo: "$59.990 CLP"
 */
function formatearPrecioCLP(monto) {
  const formateado = new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0
  }).format(monto);
  return `${formateado} CLP`;
}

/**
 * Despliega un mensaje amigable y no invasivo usando el componente Toast de Bootstrap 5.
 * @param {string} mensaje - Texto descriptivo.
 * @param {string} tipo - "success", "info", "warning", "danger".
 */
function mostrarToast(mensaje, tipo = "info") {
  const toastEl = document.getElementById("toastNotificacion");
  const mensajeEl = document.getElementById("toastMensaje");
  if (!toastEl || !mensajeEl) return;

  const colores = {
    success: "rgba(16, 185, 129, 0.95)",
    warning: "rgba(245, 158, 11, 0.95)",
    danger: "rgba(239, 68, 68, 0.95)",
    info: "rgba(37, 99, 235, 0.95)"
  };

  toastEl.style.backgroundColor = colores[tipo] || colores.info;
  toastEl.style.border = "1px solid rgba(255, 255, 255, 0.2)";
  mensajeEl.textContent = mensaje;

  if (typeof bootstrap !== "undefined" && bootstrap.Toast) {
    const bsToast = bootstrap.Toast.getOrCreateInstance(toastEl, { delay: 2500 });
    bsToast.show();
  }
}

/**
 * Crea una etiqueta visual decorativa (Badge gamer).
 * @param {string} texto
 * @param {string} claseColor
 * @returns {HTMLSpanElement}
 */
function crearBadge(texto, claseColor = "badge-featured") {
  const badge = document.createElement("span");
  badge.className = `badge ${claseColor}`;
  badge.textContent = texto;
  return badge;
}

/**
 * Crea un elemento DOM con texto seguro mediante textContent (protección XSS).
 * @param {string} etiqueta
 * @param {string} texto
 * @param {...string} clases
 * @returns {HTMLElement}
 */
function crearNodoTexto(etiqueta, texto = "", ...clases) {
  const el = document.createElement(etiqueta);
  if (texto) el.textContent = texto;
  if (clases.length > 0) el.classList.add(...clases);
  return el;
}

// ==============================================================================
// 3. CONSTRUCCIÓN MODULAR DEL DOM: TARJETAS DE VIDEOJUEGOS
// ==============================================================================

/**
 * Construye de forma dinámica la tarjeta de un videojuego en la cuadrícula gamer.
 * @param {Object} prod - Datos del videojuego.
 * @returns {HTMLElement} Nodo <article> ensamblado.
 */
function crearTarjetaProducto(prod) {
  const articulo = document.createElement("article");
  articulo.classList.add("product-card");

  // 1. Contenedor multimedia (.card-media)
  const media = document.createElement("div");
  media.classList.add("card-media");

  let claseInsignia = prod.badgeClase || "badge-featured";
  if (!prod.badgeClase && prod.badgeColor) {
    const mapa = {
      primary: "badge-goty",
      danger: "badge-special",
      warning: "badge-featured",
      success: "badge-new",
      dark: "badge-horror",
      info: "badge-popular"
    };
    claseInsignia = mapa[prod.badgeColor] || "badge-featured";
  }

  const badgePromo = crearBadge(prod.badge || "Destacado", claseInsignia);

  const img = document.createElement("img");
  img.src = prod.imagen.src;
  img.alt = prod.imagen.alt || `Portada de ${prod.nombre}`;
  img.classList.add("product-img");
  img.setAttribute("loading", "lazy");
  img.onerror = function() {
    if (this.src.includes("/img/") && !this.src.includes("/assets/img/")) {
      this.src = this.src.replace("/img/", "/assets/img/");
    }
  };

  const badgePlat = document.createElement("span");
  badgePlat.classList.add("platform-tag");
  badgePlat.textContent = prod.plataforma || "Multiplataforma";

  media.appendChild(badgePromo);
  media.appendChild(img);
  media.appendChild(badgePlat);

  // 2. Cuerpo de la tarjeta (.product-body)
  const cuerpo = document.createElement("div");
  cuerpo.classList.add("product-body");

  const titulo = crearNodoTexto("h3", prod.nombre);

  const genero = document.createElement("p");
  genero.classList.add("product-genre");
  const generoLabel = crearNodoTexto("strong", "Categoría: ");
  genero.appendChild(generoLabel);
  genero.appendChild(document.createTextNode(prod.categoria));

  const descripcion = crearNodoTexto("p", prod.descripcion, "product-desc");

  // Caja de precio y disponibilidad (.product-price-box)
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

  // Botón de compra interactivo (Evento click para agregar al carrito)
  const botonComprar = document.createElement("button");
  botonComprar.type = "button";
  botonComprar.classList.add("btn-buy");
  botonComprar.textContent = "🛒 Añadir al Carrito";

  botonComprar.addEventListener("click", () => {
    // Llamar a la función del módulo carrito.js
    if (typeof agregarAlCarrito === "function") {
      agregarAlCarrito(prod);
    }

    const textoPrevio = botonComprar.textContent;
    botonComprar.textContent = "✅ ¡Añadido!";
    botonComprar.style.backgroundColor = "var(--accent-green)";
    botonComprar.style.borderColor = "var(--accent-green)";

    setTimeout(() => {
      botonComprar.textContent = textoPrevio;
      botonComprar.style.backgroundColor = "";
      botonComprar.style.borderColor = "";
    }, 1200);
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
 * Renderiza el arreglo de productos en la cuadrícula del DOM.
 * @param {Array<Object>} productos
 */
function mostrarProductos(productos) {
  const contenedor = document.getElementById("contenedor_productos");
  if (!contenedor) return;

  contenedor.innerHTML = "";

  if (productos.length === 0) {
    contenedor.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem;">
        <p style="color: var(--text-muted); font-size: 1.1rem;">No se encontraron videojuegos que coincidan con la búsqueda.</p>
        <button type="button" class="btn" onclick="restablecerFiltros()" style="margin-top: 0.75rem; background: var(--accent-blue); color: #ffffff; padding: 0.5rem 1.2rem; border-radius: var(--radius-sm); border: none; cursor: pointer;">
          Mostrar todos los juegos
        </button>
      </div>
    `;
    return;
  }

  productos.forEach((prod) => {
    const tarjeta = crearTarjetaProducto(prod);
    contenedor.appendChild(tarjeta);
  });
}

// ==============================================================================
// 4. CARGA ASÍNCRONA MEDIANTE FETCH API (JSON LOCAL)
// ==============================================================================

/**
 * Carga el catálogo de videojuegos desde el archivo local data/productos.json.
 * Gestiona errores con mensajes amigables en el DOM y Toasts informativos.
 */
async function cargarProductos() {
  const contenedor = document.getElementById("contenedor_productos");
  if (!contenedor) return;

  // Si se ejecuta mediante el protocolo file://, utilizar el respaldo en memoria local
  if (window.location.protocol === "file:") {
    console.info("Protocolo local file:// detectado: Cargando catálogo desde respaldo en memoria.");
    productosCatalogo = [...PRODUCTOS_DEFAULT];
    mostrarProductos(productosCatalogo);
    return;
  }

  // Indicador visual de carga
  contenedor.innerHTML = `
    <div class="spinner-caja" id="spinner_carga" style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem;">
      <div class="spinner-gamer" role="status" aria-label="Cargando catálogo"></div>
      <p style="color: var(--text-muted); margin-top: 1rem; font-weight: 600;">
        Cargando catálogo oficial de videojuegos...
      </p>
    </div>
  `;

  try {
    const respuesta = await fetch("data/productos.json");

    if (!respuesta.ok) {
      throw new Error(`Error HTTP: ${respuesta.status}`);
    }

    const datos = await respuesta.json();
    productosCatalogo = datos;
    mostrarProductos(productosCatalogo);
  } catch (error) {
    console.warn("Fallo en Fetch API al obtener data/productos.json. Activando catálogo de respaldo:", error);

    // Gestión básica de errores requerida: Mensaje amigable en caso de que los datos no se carguen correctamente
    mostrarToast("No fue posible conectar con el servidor de datos. Mostrando catálogo local.", "warning");

    productosCatalogo = [...PRODUCTOS_DEFAULT];
    mostrarProductos(productosCatalogo);
  }
}

// ==============================================================================
// 5. BÚSQUEDA Y FILTRADO DE PRODUCTOS (EVENTO SUBMIT Y CLICKS)
// ==============================================================================

/**
 * Filtra el catálogo según el término de búsqueda ingresado.
 * @param {string} termino
 */
function filtrarPorBusqueda(termino) {
  const normalizado = termino.trim().toLowerCase();
  if (!normalizado) {
    mostrarProductos(productosCatalogo);
    return;
  }

  const filtrados = productosCatalogo.filter((prod) =>
    prod.nombre.toLowerCase().includes(normalizado) ||
    prod.categoria.toLowerCase().includes(normalizado) ||
    prod.plataforma.toLowerCase().includes(normalizado)
  );

  mostrarProductos(filtrados);
}

/**
 * Filtra el catálogo según la categoría seleccionada.
 * @param {string} categoria
 */
function filtrarPorCategoria(categoria) {
  document.querySelectorAll(".btn-filtro-cat").forEach((btn) => {
    if (btn.dataset.categoria === categoria) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  if (categoria === "todos") {
    mostrarProductos(productosCatalogo);
    return;
  }

  const normalizada = categoria.toLowerCase().trim();
  const filtrados = productosCatalogo.filter((p) =>
    p.categoria.toLowerCase().trim() === normalizada
  );

  mostrarProductos(filtrados);
}

/**
 * Restablece todos los filtros aplicados.
 */
function restablecerFiltros() {
  const inputBusqueda = document.getElementById("input_busqueda");
  if (inputBusqueda) inputBusqueda.value = "";
  filtrarPorCategoria("todos");
}

// ==============================================================================
// 6. EVENTOS DE INTERACCIÓN GENERAL DEL DOM
// ==============================================================================
document.addEventListener("DOMContentLoaded", () => {
  // 1. Carga inicial del catálogo
  cargarProductos();

  // 2. Evento submit del Formulario de Búsqueda
  const formBusqueda = document.getElementById("form_busqueda");
  const inputBusqueda = document.getElementById("input_busqueda");

  if (formBusqueda && inputBusqueda) {
    formBusqueda.addEventListener("submit", (evento) => {
      evento.preventDefault(); // Prevenir recarga de página
      filtrarPorBusqueda(inputBusqueda.value);
    });

    inputBusqueda.addEventListener("input", (evento) => {
      filtrarPorBusqueda(evento.target.value);
    });
  }

  // 3. Botones de filtro de categorías
  document.querySelectorAll(".btn-filtro-cat").forEach((btn) => {
    btn.addEventListener("click", () => {
      filtrarPorCategoria(btn.dataset.categoria);
    });
  });

  // 4. Enlaces de categorías del navbar
  document.querySelectorAll(".btn-categoria-nav").forEach((enlace) => {
    enlace.addEventListener("click", (e) => {
      e.preventDefault();
      const cat = enlace.dataset.categoria;
      filtrarPorCategoria(cat);

      const secProds = document.getElementById("productos");
      if (secProds) secProds.scrollIntoView({ behavior: "smooth" });
    });
  });

  // 5. Botón de Ofertas en Hero
  const botonOfertas = document.getElementById("boton_ofertas");
  const seccionOfertas = document.getElementById("seccion_ofertas");
  if (botonOfertas && seccionOfertas) {
    botonOfertas.addEventListener("click", () => {
      seccionOfertas.classList.toggle("d-none");
      if (!seccionOfertas.classList.contains("d-none")) {
        seccionOfertas.scrollIntoView({ behavior: "smooth" });
        mostrarToast("¡Disfruta de nuestras ofertas exclusivas en pases de temporada y DLCs!", "info");
      }
    });
  }

  // 6. Control de Pausa / Reanudación del Carrusel
  const carruselEl = document.getElementById("carruselHero");
  const btnPausa = document.getElementById("btn_pausa_carrusel");
  if (carruselEl && btnPausa && typeof bootstrap !== "undefined") {
    let pausado = false;
    const bsCarousel = bootstrap.Carousel.getOrCreateInstance(carruselEl);

    btnPausa.addEventListener("click", () => {
      if (pausado) {
        bsCarousel.cycle();
        btnPausa.textContent = "⏸️ Pausar carrusel";
        btnPausa.setAttribute("aria-pressed", "false");
        pausado = false;
      } else {
        bsCarousel.pause();
        btnPausa.textContent = "▶️ Reanudar carrusel";
        btnPausa.setAttribute("aria-pressed", "true");
        pausado = true;
      }
    });
  }

  // 7. Eventos mouseover y mouseout para realce visual dinámico
  const tarjetasCategorias = document.querySelectorAll(".category-card");
  tarjetasCategorias.forEach((tarjeta) => {
    tarjeta.addEventListener("mouseover", () => {
      tarjeta.style.transform = "translateX(8px) scale(1.01)";
      tarjeta.style.boxShadow = "0 6px 20px rgba(0, 240, 255, 0.25)";
    });
    tarjeta.addEventListener("mouseout", () => {
      tarjeta.style.transform = "";
      tarjeta.style.boxShadow = "";
    });
  });

  // Microinteracción mouseover / mouseout en el texto orientador del catálogo
  const leadInfo = document.getElementById("lead_info");
  if (leadInfo) {
    leadInfo.addEventListener("mouseover", () => {
      leadInfo.style.color = "#ffffff";
      leadInfo.style.textShadow = "0 0 10px rgba(255, 255, 255, 0.5)";
    });
    leadInfo.addEventListener("mouseout", () => {
      leadInfo.style.color = "";
      leadInfo.style.textShadow = "";
    });
  }
});

/**
 * Función para restablecer estilos en línea masivamente.
 * Recorre los párrafos y remueve estilos inline para devolver el control a la hoja CSS.
 */
function reestablecerColores() {
  const parrafos = document.querySelectorAll("p");
  parrafos.forEach((p) => {
    p.style.color = "";
  });
}

