/**
 * ==============================================================================
 * ERIGAMESSTORE - LÓGICA DE JAVASCRIPT MODULAR (ES6+)
 * Asignatura: Desarrollo Frontend I (PFY2201)
 * Estudiante: Carolina Delgado | Duoc UC
 * ==============================================================================
 */

// ==============================================================================
// 1. ESTADO GLOBAL Y CATÁLOGO DE RESPALDO (FALLBACK EN MEMORIA)
// ==============================================================================

/**
 * Catálogo general de videojuegos en memoria (evita bloqueo por CORS al abrir vía file://).
 * @constant {Array<Object>}
 */
const PRODUCTOS_DEFAULT = [
  {
    id: "prod-1",
    nombre: "The Legend of Zelda: Tears of the Kingdom",
    categoria: "Aventura y Acción",
    precio: 54990,
    descripcion: "Acompaña a Link en una épica travesía por los cielos y las profundidades de Hyrule.",
    badge: "Destacado",
    badgeClase: "badge-featured",
    plataforma: "Nintendo Switch",
    imagen: {
      src: "img/zelda-totk.jpg",
      alt: "Portada de The Legend of Zelda: Tears of the Kingdom"
    }
  },
  {
    id: "prod-2",
    nombre: "Cyberpunk 2077: Phantom Liberty",
    categoria: "Rol (RPG)",
    precio: 39990,
    descripcion: "Thriller de espionaje, tecnología y acción en el peligroso distrito de Dogtown.",
    badge: "Oferta",
    badgeClase: "badge-special",
    plataforma: "PS5 / Xbox / PC",
    imagen: {
      src: "img/cyberpunk-2077.jpg",
      alt: "Portada de Cyberpunk 2077: Phantom Liberty"
    }
  },
  {
    id: "prod-3",
    nombre: "Super Mario Bros. Wonder",
    categoria: "Plataformas",
    precio: 49990,
    descripcion: "Aventura 2D innovadora con efectos Maravilla que transforman los escenarios.",
    badge: "Popular",
    badgeClase: "badge-popular",
    plataforma: "Nintendo Switch",
    imagen: {
      src: "img/mario-wonder.jpg",
      alt: "Portada de Super Mario Bros. Wonder"
    }
  },
  {
    id: "prod-4",
    nombre: "EA Sports FC 24",
    categoria: "Deportes",
    precio: 42990,
    descripcion: "Simulación de fútbol con tecnología HyperMotionV y estilos de juego realistas.",
    badge: "Nuevo",
    badgeClase: "badge-new",
    plataforma: "Multiplataforma",
    imagen: {
      src: "img/fc24.jpg",
      alt: "Portada de EA Sports FC 24"
    }
  },
  {
    id: "prod-5",
    nombre: "Resident Evil 4 Remake",
    categoria: "Survival Horror",
    precio: 44990,
    descripcion: "Remake magistral del clásico de supervivencia con gráficos ultrarrealistas.",
    badge: "Imperdible",
    badgeClase: "badge-horror",
    plataforma: "PS5 / Xbox / PC",
    imagen: {
      src: "img/resident-evil-4.jpg",
      alt: "Portada de Resident Evil 4 Remake"
    }
  },
  {
    id: "prod-6",
    nombre: "Final Fantasy VII Rebirth",
    categoria: "Rol (RPG)",
    precio: 59990,
    descripcion: "La aventura de Cloud y sus aliados continúa por un mundo expansivo e inexplorado.",
    badge: "Exclusivo",
    badgeClase: "badge-goty",
    plataforma: "PlayStation 5",
    imagen: {
      src: "img/ffvii-rebirth.jpg",
      alt: "Portada de Final Fantasy VII Rebirth"
    }
  }
];

/**
 * Catálogo de productos activo.
 * @type {Array<Object>}
 */
let productosCatalogo = [];

/**
 * Estado del carrito de compras cargado desde LocalStorage.
 * @type {Array<Object>}
 */
let carritoCompras = [];

/**
 * Constantes de configuración de solicitudes asíncronas.
 */
const TIMEOUT_FETCH_MS = 6000;
const MAX_INTENTOS_FETCH = 3;
let intentosCarga = 0;

// ==============================================================================
// 2. UTILIDADES Y FUNCIONES REUTILIZABLES (HELPERS)
// ==============================================================================

/**
 * Formatea un valor numérico a moneda local chilena (CLP).
 * @param {number|string} monto
 * @returns {string} Cadena formateada (ej: "$54.990 CLP").
 */
function formatearPrecioCLP(monto) {
  return `$${Number(monto).toLocaleString("es-CL")} CLP`;
}

/**
 * Crea un nodo badge con estilo gamer.
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
// 3. CONSTRUCCIÓN MODULAR DEL DOM (TARJETAS GAMER ORIGINALES)
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

  // Botón de compra interactivo (.btn-buy)
  const botonComprar = document.createElement("button");
  botonComprar.type = "button";
  botonComprar.classList.add("btn-buy");
  botonComprar.textContent = "🛒 Añadir al Carrito";

  // Microinteracción al hacer clic y agregado al carrito
  botonComprar.addEventListener("click", () => {
    agregarAlCarrito(prod);

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
// 4. CARGA ASÍNCRONA CON FETCH API, ABORTCONTROLLER Y FALLBACK SEGURO
// ==============================================================================

/**
 * Carga el catálogo de productos con control de tiempo de espera y manejo de errores.
 * Utiliza async/await con Fetch API, AbortController y respaldo automático para máxima resiliencia.
 */
async function cargarProductos() {
  const contenedor = document.getElementById("contenedor_productos");
  if (!contenedor) return;

  // Si se ejecuta mediante el protocolo file://, utilizar el respaldo en memoria de inmediato
  if (window.location.protocol === "file:") {
    console.info("Protocolo local file:// detectado: Cargando catálogo desde memoria local.");
    productosCatalogo = [...PRODUCTOS_DEFAULT];
    mostrarProductos(productosCatalogo);
    return;
  }

  intentosCarga++;

  // Indicador visual de carga (Spinner gamer)
  contenedor.innerHTML = `
    <div class="spinner-caja" id="spinner_carga" style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem;">
      <div class="spinner-gamer" role="status" aria-label="Cargando catálogo"></div>
      <p style="color: var(--text-muted); margin-top: 1rem; font-weight: 600;">
        Cargando catálogo oficial de videojuegos... (Intento ${intentosCarga} de ${MAX_INTENTOS_FETCH})
      </p>
    </div>
  `;

  const controlador = new AbortController();
  const temporizador = setTimeout(() => {
    controlador.abort();
  }, TIMEOUT_FETCH_MS);

  try {
    const respuesta = await fetch("data/productos.json", { signal: controlador.signal });
    clearTimeout(temporizador);

    if (!respuesta.ok) {
      throw new Error(`Error en respuesta del servidor: ${respuesta.status}`);
    }

    const datos = await respuesta.json();
    intentosCarga = 0;
    productosCatalogo = datos;
    mostrarProductos(productosCatalogo);
  } catch (error) {
    clearTimeout(temporizador);
    console.warn("Fallo o interrupción en Fetch API. Activando catálogo de respaldo:", error);

    // Activar datos de respaldo para garantizar visualización continua en la interfaz
    productosCatalogo = [...PRODUCTOS_DEFAULT];
    mostrarProductos(productosCatalogo);
  }
}

// ==============================================================================
// 5. GESTIÓN DEL CARRITO DE COMPRAS CON LOCALSTORAGE
// ==============================================================================

/**
 * Inicializa y carga el carrito desde LocalStorage.
 */
function inicializarCarrito() {
  try {
    const guardado = localStorage.getItem("erigames_carrito");
    carritoCompras = guardado ? JSON.parse(guardado) : [];
  } catch (e) {
    console.warn("No fue posible acceder a localStorage:", e);
    carritoCompras = [];
  }
  actualizarVistaCarrito();
}

/**
 * Guarda el estado actual del carrito en LocalStorage.
 */
function guardarCarrito() {
  try {
    localStorage.setItem("erigames_carrito", JSON.stringify(carritoCompras));
  } catch (e) {
    console.warn("Error al guardar en localStorage:", e);
  }
  actualizarVistaCarrito();
}

/**
 * Añade un videojuego al carrito o incrementa su cantidad si ya existe.
 * @param {Object} producto
 */
function agregarAlCarrito(producto) {
  const itemExistente = carritoCompras.find((item) => String(item.id) === String(producto.id));

  if (itemExistente) {
    itemExistente.cantidad += 1;
  } else {
    carritoCompras.push({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      plataforma: producto.plataforma,
      imagen: producto.imagen.src,
      cantidad: 1
    });
  }

  guardarCarrito();

  // Animación del badge del carrito
  const badgeEl = document.getElementById("badge-contador-carrito");
  if (badgeEl) {
    badgeEl.classList.remove("badge-pulse");
    void badgeEl.offsetWidth; // Forzar reflujo para reiniciar animación
    badgeEl.classList.add("badge-pulse");
  }

  // Desplegar automáticamente el panel lateral del carrito de Bootstrap
  const offcanvasEl = document.getElementById("offcanvasCarrito");
  if (offcanvasEl && typeof bootstrap !== "undefined") {
    const bsOffcanvas = bootstrap.Offcanvas.getOrCreateInstance(offcanvasEl);
    bsOffcanvas.show();
  }
}

/**
 * Modifica la cantidad de un ítem en el carrito.
 * @param {string|number} prodId
 * @param {number} delta - Variación (+1 o -1).
 */
function modificarCantidadCarrito(prodId, delta) {
  const item = carritoCompras.find((i) => String(i.id) === String(prodId));
  if (!item) return;

  item.cantidad += delta;
  if (item.cantidad <= 0) {
    carritoCompras = carritoCompras.filter((i) => String(i.id) !== String(prodId));
  }

  guardarCarrito();
}

/**
 * Elimina un producto del carrito.
 * @param {string|number} prodId
 */
function eliminarDelCarrito(prodId) {
  carritoCompras = carritoCompras.filter((item) => String(item.id) !== String(prodId));
  guardarCarrito();
}

/**
 * Vacía por completo el carrito de compras.
 */
function vaciarCarrito() {
  if (carritoCompras.length === 0) return;
  carritoCompras = [];
  guardarCarrito();
}

/**
 * Procesa la finalización de compra y limpia el carrito.
 */
function iniciarCheckout() {
  if (carritoCompras.length === 0) {
    alert("El carrito está vacío. Añade videojuegos para continuar.");
    return;
  }
  alert("¡Gracias por tu compra en EriGamesStore! Te contactaremos para coordinar el despacho.");
  vaciarCarrito();
  const offcanvasEl = document.getElementById("offcanvasCarrito");
  if (offcanvasEl && typeof bootstrap !== "undefined") {
    const modal = bootstrap.Offcanvas.getInstance(offcanvasEl);
    if (modal) modal.hide();
  }
}

/**
 * Actualiza la interfaz visual del carrito (Offcanvas, contador y resumen en página designada).
 */
function actualizarVistaCarrito() {
  const badgeContador = document.getElementById("badge-contador-carrito");
  const areaResumen = document.getElementById("area-resumen-carrito");
  const totalEl = document.getElementById("total-carrito");

  // Calcular totales
  const totalCantidad = carritoCompras.reduce((acc, item) => acc + item.cantidad, 0);
  const totalPrecio = carritoCompras.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

  // Actualizar contador del navbar (escritorio y móvil)
  document.querySelectorAll(".badge-contador-movil, #badge-contador-carrito").forEach((b) => {
    b.textContent = totalCantidad;
  });

  // Actualizar monto total del panel Offcanvas
  if (totalEl) {
    totalEl.textContent = formatearPrecioCLP(totalPrecio);
  }

  // 1. Actualizar lista en el panel lateral Offcanvas
  if (areaResumen) {
    if (carritoCompras.length === 0) {
      areaResumen.innerHTML = `
        <div style="text-align: center; padding: 2.5rem 1rem; color: var(--text-muted);">
          <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">🛒</div>
          <p style="margin-bottom: 0.25rem; font-weight: 600;">Tu carrito está vacío.</p>
          <small style="color: var(--text-muted);">Añade títulos desde el catálogo para comenzar.</small>
        </div>
      `;
    } else {
      areaResumen.innerHTML = "";

      carritoCompras.forEach((item) => {
        const cardItem = document.createElement("div");
        cardItem.className = "cart-item-card";

        cardItem.innerHTML = `
          <img src="${item.imagen}" alt="${item.nombre}" class="cart-item-img">
          <div class="cart-item-details">
            <h6 class="cart-item-title">${item.nombre}</h6>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 4px;">
              <span class="cart-item-price">${formatearPrecioCLP(item.precio)}</span>
              <div style="display: flex; align-items: center; gap: 4px;">
                <button type="button" class="btn btn-sm btn-outline-secondary btn-restar-qty" data-id="${item.id}" style="padding: 0 6px; font-size: 0.75rem; color: #fff;">-</button>
                <span style="font-size: 0.8rem; font-weight: 700; padding: 0 4px;">${item.cantidad}</span>
                <button type="button" class="btn btn-sm btn-outline-secondary btn-sumar-qty" data-id="${item.id}" style="padding: 0 6px; font-size: 0.75rem; color: #fff;">+</button>
              </div>
            </div>
          </div>
          <button type="button" class="btn-eliminar-item" data-id="${item.id}" title="Eliminar del carrito" aria-label="Eliminar ${item.nombre}" style="background: transparent; border: none; color: var(--accent-red); font-size: 1rem; cursor: pointer; padding: 4px;">
            ✖
          </button>
        `;

        // Eventos de botones en panel Offcanvas
        cardItem.querySelector(".btn-restar-qty").addEventListener("click", () => modificarCantidadCarrito(item.id, -1));
        cardItem.querySelector(".btn-sumar-qty").addEventListener("click", () => modificarCantidadCarrito(item.id, 1));
        cardItem.querySelector(".btn-eliminar-item").addEventListener("click", () => eliminarDelCarrito(item.id));

        areaResumen.appendChild(cardItem);
      });
    }
  }

  // 2. Actualizar área de resumen designada en la página principal (#contenedor-resumen-pagina)
  const resumenPagina = document.getElementById("contenedor-resumen-pagina");
  if (resumenPagina) {
    if (carritoCompras.length === 0) {
      resumenPagina.innerHTML = `
        <div class="carrito-vacio-aviso">
          <p style="color: var(--text-muted); font-size: 1.1rem; margin-bottom: 0.5rem;">Tu carrito de compras está vacío.</p>
          <small style="color: var(--text-muted);">Haz clic en "Añadir al Carrito" en cualquiera de nuestros títulos para armar tu pedido.</small>
        </div>
      `;
    } else {
      let filasHtml = "";
      carritoCompras.forEach((item) => {
        const subtotal = item.precio * item.cantidad;
        filasHtml += `
          <div class="carrito-fila-item">
            <img src="${item.imagen}" alt="${item.nombre}" class="carrito-fila-img" onerror="if(this.src.includes('/img/')&&!this.src.includes('/assets/img/')){this.src=this.src.replace('/img/','/assets/img/');}">
            <div class="carrito-fila-info">
              <h4>${item.nombre}</h4>
              <span class="carrito-fila-plataforma">${item.plataforma || "Multiplataforma"}</span>
            </div>
            <div class="carrito-fila-precio">
              ${formatearPrecioCLP(item.precio)}
            </div>
            <div class="carrito-fila-controles">
              <button type="button" class="btn-qty btn-restar-qty" data-id="${item.id}" aria-label="Disminuir cantidad">-</button>
              <span class="qty-num">${item.cantidad}</span>
              <button type="button" class="btn-qty btn-sumar-qty" data-id="${item.id}" aria-label="Aumentar cantidad">+</button>
            </div>
            <div class="carrito-fila-subtotal">
              ${formatearPrecioCLP(subtotal)}
            </div>
            <button type="button" class="btn-eliminar-fila" data-id="${item.id}" aria-label="Eliminar ${item.nombre}">
              Eliminar
            </button>
          </div>
        `;
      });

      resumenPagina.innerHTML = `
        <div class="carrito-tabla-contenedor">
          ${filasHtml}
        </div>
        <div class="carrito-resumen-footer">
          <div class="carrito-total-box">
            <span>Total estimado (${totalCantidad} ${totalCantidad === 1 ? 'juego' : 'juegos'}):</span>
            <strong class="total-monto">${formatearPrecioCLP(totalPrecio)}</strong>
          </div>
          <div class="carrito-acciones-box">
            <button type="button" class="btn-vaciar-pagina" id="btn-vaciar-pagina">
              Vaciar carrito
            </button>
            <button type="button" class="btn-checkout-pagina" id="btn-checkout-pagina">
              Completar compra
            </button>
          </div>
        </div>
      `;

      // Eventos de botones en la sección designada
      const btnVaciarPagina = resumenPagina.querySelector("#btn-vaciar-pagina");
      if (btnVaciarPagina) {
        btnVaciarPagina.addEventListener("click", vaciarCarrito);
      }
      const btnCheckoutPagina = resumenPagina.querySelector("#btn-checkout-pagina");
      if (btnCheckoutPagina) {
        btnCheckoutPagina.addEventListener("click", iniciarCheckout);
      }

      resumenPagina.querySelectorAll(".btn-restar-qty").forEach(btn => {
        btn.addEventListener("click", () => modificarCantidadCarrito(btn.dataset.id, -1));
      });
      resumenPagina.querySelectorAll(".btn-sumar-qty").forEach(btn => {
        btn.addEventListener("click", () => modificarCantidadCarrito(btn.dataset.id, 1));
      });
      resumenPagina.querySelectorAll(".btn-eliminar-fila").forEach(btn => {
        btn.addEventListener("click", () => eliminarDelCarrito(btn.dataset.id));
      });
    }
  }
}

// ==============================================================================
// 6. BUSCADOR Y FILTROS POR CATEGORÍA
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
  // Actualizar estado activo en los botones de filtro
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

  const filtrados = productosCatalogo.filter((p) =>
    p.categoria.toLowerCase().includes(categoria.toLowerCase())
  );
  mostrarProductos(filtrados);
}

/**
 * Restablece los filtros para mostrar todos los juegos.
 */
function restablecerFiltros() {
  const inputBusqueda = document.getElementById("input-busqueda");
  if (inputBusqueda) inputBusqueda.value = "";
  filtrarPorCategoria("todos");
}

// ==============================================================================
// 7. INTERACTIVIDAD DEL CARRUSEL, OFERTAS Y FORMULARIO DE CONTACTO
// ==============================================================================

/**
 * Configura los eventos del carrusel, ofertas interactivas y formulario.
 */
function inicializarEventosUI() {
  // 1. Control de Pausa / Reproducción del Carrusel (Accesibilidad)
  const btnPausa = document.getElementById("btn_pausa_carrusel");
  const carruselEl = document.getElementById("carruselEriGames");

  if (btnPausa && carruselEl && typeof bootstrap !== "undefined") {
    const carruselBS = bootstrap.Carousel.getOrCreateInstance(carruselEl);
    let estaPausado = false;

    btnPausa.addEventListener("click", () => {
      if (estaPausado) {
        carruselBS.cycle();
        btnPausa.textContent = "⏸️ Pausar";
        btnPausa.setAttribute("aria-label", "Pausar rotación automática del carrusel");
        estaPausado = false;
      } else {
        carruselBS.pause();
        btnPausa.textContent = "▶️ Reanudar";
        btnPausa.setAttribute("aria-label", "Reanudar rotación automática del carrusel");
        estaPausado = true;
      }
    });
  }

  // 2. Alternar sección de ofertas mediante evento click
  const botonOfertas = document.getElementById("boton_ofertas");
  const seccionOfertas = document.getElementById("seccion_ofertas");

  if (botonOfertas && seccionOfertas) {
    botonOfertas.addEventListener("click", () => {
      const oculta = seccionOfertas.classList.toggle("d-none");
      botonOfertas.textContent = oculta ? "🔥 Ver Ofertas Especiales" : "✖️ Ocultar Ofertas";
    });
  }

  // 3. Efectos mouseover y mouseout en el texto orientador
  const leadInfo = document.getElementById("lead_info");
  if (leadInfo) {
    leadInfo.addEventListener("mouseover", () => {
      leadInfo.style.color = "var(--accent-cyan)";
      leadInfo.style.transition = "color var(--transition-fast)";
    });
    leadInfo.addEventListener("mouseout", () => {
      leadInfo.style.color = "";
    });
  }

  // 4. Formulario de Búsqueda
  const formBusqueda = document.getElementById("formulario-busqueda");
  const inputBusqueda = document.getElementById("input-busqueda");

  if (formBusqueda && inputBusqueda) {
    formBusqueda.addEventListener("submit", (e) => {
      e.preventDefault();
      filtrarPorBusqueda(inputBusqueda.value);
    });

    inputBusqueda.addEventListener("input", () => {
      filtrarPorBusqueda(inputBusqueda.value);
    });
  }

  // 5. Botones de filtro rápido por categoría
  document.querySelectorAll(".btn-filtro-cat").forEach((btn) => {
    btn.addEventListener("click", () => {
      filtrarPorCategoria(btn.dataset.categoria);
    });
  });

  // Botones de categoría en el menú desplegable de la barra de navegación
  document.querySelectorAll(".btn-categoria-nav").forEach((btn) => {
    btn.addEventListener("click", () => {
      filtrarPorCategoria(btn.dataset.categoria);
      const seccion = document.getElementById("productos");
      if (seccion) seccion.scrollIntoView({ behavior: "smooth" });
    });
  });

  // 6. Botones del Carrito (Vaciar y Finalizar)
  const btnVaciar = document.getElementById("btn-vaciar-carrito");
  if (btnVaciar) {
    btnVaciar.addEventListener("click", () => {
      if (confirm("¿Estás seguro de que deseas vaciar el carrito?")) {
        vaciarCarrito();
      }
    });
  }

  const btnFinalizar = document.getElementById("btn-finalizar-compra");
  if (btnFinalizar) {
    btnFinalizar.addEventListener("click", iniciarCheckout);
  }

  // 7. Validación del Formulario de Contacto
  const formContacto = document.getElementById("form_contacto");
  if (formContacto) {
    formContacto.addEventListener("submit", (evento) => {
      evento.preventDefault();

      const inputNombre = document.getElementById("nombre");
      const inputEmail = document.getElementById("email");
      const selectMotivo = document.getElementById("motivo");
      const textareaMensaje = document.getElementById("mensaje");
      const divEstado = document.getElementById("mensaje_estado");

      // Spans de error
      const errNombre = document.getElementById("error_nombre");
      const errEmail = document.getElementById("error_email");
      const errMotivo = document.getElementById("error_motivo");
      const errMensaje = document.getElementById("error_mensaje");

      // Limpiar errores previos
      [errNombre, errEmail, errMotivo, errMensaje].forEach((span) => {
        if (span) {
          span.textContent = "";
          span.style.display = "none";
        }
      });
      [inputNombre, inputEmail, selectMotivo, textareaMensaje].forEach((input) => {
        if (input) input.style.borderColor = "";
      });

      let esValido = true;

      // Validación Nombre
      if (!inputNombre.value.trim() || inputNombre.value.trim().length < 3) {
        mostrarErrorInput(inputNombre, errNombre, "Ingresa un nombre válido (mínimo 3 caracteres).");
        esValido = false;
      }

      // Validación Correo
      const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!regexEmail.test(inputEmail.value.trim())) {
        mostrarErrorInput(inputEmail, errEmail, "Ingresa un correo electrónico con formato válido.");
        esValido = false;
      }

      // Validación Motivo
      if (!selectMotivo.value) {
        mostrarErrorInput(selectMotivo, errMotivo, "Selecciona un motivo de consulta.");
        esValido = false;
      }

      // Validación Mensaje
      if (!textareaMensaje.value.trim() || textareaMensaje.value.trim().length < 10) {
        mostrarErrorInput(textareaMensaje, errMensaje, "El mensaje debe contener al menos 10 caracteres.");
        esValido = false;
      }

      if (!esValido) {
        if (divEstado) {
          divEstado.style.display = "block";
          divEstado.style.backgroundColor = "rgba(239, 68, 68, 0.15)";
          divEstado.style.border = "1px solid var(--accent-red)";
          divEstado.style.color = "#fca5a5";
          divEstado.textContent = "Por favor, completa correctamente todos los campos obligatorios.";
        }
        return;
      }

      // Formulario exitoso
      if (divEstado) {
        divEstado.style.display = "block";
        divEstado.style.backgroundColor = "rgba(16, 185, 129, 0.15)";
        divEstado.style.border = "1px solid var(--accent-green)";
        divEstado.style.color = "#86efac";
        divEstado.textContent = `¡Gracias por contactarnos, ${inputNombre.value.trim()}! Hemos recibido tu mensaje y te responderemos a la brevedad.`;
      }

      formContacto.reset();

      setTimeout(() => {
        if (divEstado) divEstado.style.display = "none";
      }, 5000);
    });
  }
}

/**
 * Despliega un mensaje de error inline y resalta el campo inválido.
 * @param {HTMLElement} inputEl
 * @param {HTMLElement} errorSpanEl
 * @param {string} mensaje
 */
function mostrarErrorInput(inputEl, errorSpanEl, mensaje) {
  if (inputEl) inputEl.style.borderColor = "var(--accent-red)";
  if (errorSpanEl) {
    errorSpanEl.textContent = mensaje;
    errorSpanEl.style.display = "block";
  }
}

// ==============================================================================
// 8. INICIALIZACIÓN GENERAL DE LA APLICACIÓN AL CARGAR EL DOM
// ==============================================================================
document.addEventListener("DOMContentLoaded", () => {
  inicializarCarrito();
  cargarProductos();
  inicializarEventosUI();
});
