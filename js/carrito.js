/**
 * ==============================================================================
 * ARCHIVO: js/carrito.js
 * ASIGNATURA: Desarrollo Frontend I (PFY2201) - Semana 6
 * ALUMNA: Carolina Delgado
 * DESCRIPCIÓN: Módulo encargado de la gestión del carrito de compras.
 *              Implementa persistencia en LocalStorage, cálculo de totales,
 *              manipulación reactiva del DOM (en panel Offcanvas y en el área
 *              designada de la página), confirmación de eliminación y Toasts.
 * ==============================================================================
 */

"use strict";

// Estado en memoria del carrito
let carritoCompras = [];

// ==============================================================================
// 1. PERSISTENCIA CON LOCALSTORAGE (MÉTODOS VISTOS EN CLASE)
// ==============================================================================

/**
 * Lee el carrito desde LocalStorage y lo convierte desde cadena JSON.
 * @returns {Array<Object>}
 */
function leerCarrito() {
  try {
    const datos = localStorage.getItem("erigames_carrito");
    return datos ? JSON.parse(datos) : [];
  } catch (error) {
    console.warn("No fue posible acceder a localStorage:", error);
    return [];
  }
}

/**
 * Serializa y almacena el estado actual del carrito en LocalStorage.
 */
function guardarCarrito() {
  try {
    localStorage.setItem("erigames_carrito", JSON.stringify(carritoCompras));
  } catch (error) {
    console.warn("Error al guardar en localStorage:", error);
  }
  actualizarVistaCarrito();
}

/**
 * Inicializa el carrito al cargar la página.
 */
function inicializarCarrito() {
  carritoCompras = leerCarrito();
  actualizarVistaCarrito();
}

// ==============================================================================
// 2. OPERACIONES DEL CARRITO (AÑADIR, MODIFICAR, ELIMINAR, VACIAR)
// ==============================================================================

/**
 * Añade un videojuego al carrito o incrementa su cantidad si ya existe.
 * @param {Object} producto - Objeto del videojuego.
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
      plataforma: producto.plataforma || "Multiplataforma",
      imagen: producto.imagen.src,
      cantidad: 1
    });
  }

  guardarCarrito();

  // Animación visual del badge numérico en el menú superior
  const badgeEl = document.getElementById("badge-contador-carrito");
  if (badgeEl) {
    badgeEl.classList.remove("badge-pulse");
    void badgeEl.offsetWidth; // Reiniciar animación
    badgeEl.classList.add("badge-pulse");
  }

  // Notificación amigable mediante Toast
  if (typeof mostrarToast === "function") {
    mostrarToast(`¡${producto.nombre} añadido al carrito!`, "success");
  }

  // Desplegar automáticamente el panel lateral Offcanvas para retroalimentación inmediata
  const offcanvasEl = document.getElementById("offcanvasCarrito");
  if (offcanvasEl && typeof bootstrap !== "undefined") {
    const bsOffcanvas = bootstrap.Offcanvas.getOrCreateInstance(offcanvasEl);
    bsOffcanvas.show();
  }
}

/**
 * Modifica la cantidad de un ítem en el carrito (+1 o -1).
 * @param {string|number} prodId
 * @param {number} delta
 */
function modificarCantidadCarrito(prodId, delta) {
  const item = carritoCompras.find((i) => String(i.id) === String(prodId));
  if (!item) return;

  item.cantidad += delta;
  if (item.cantidad <= 0) {
    carritoCompras = carritoCompras.filter((i) => String(i.id) !== String(prodId));
    if (typeof mostrarToast === "function") {
      mostrarToast(`"${item.nombre}" eliminado del carrito.`, "danger");
    }
  }

  guardarCarrito();
}

/**
 * Elimina un producto del carrito con confirmación previa.
 * @param {string|number} prodId
 */
function eliminarDelCarrito(prodId) {
  const item = carritoCompras.find((i) => String(i.id) === String(prodId));
  const nombreItem = item ? item.nombre : "este videojuego";

  if (confirm(`¿Estás seguro/a de eliminar "${nombreItem}" del carrito de compras?`)) {
    carritoCompras = carritoCompras.filter((i) => String(i.id) !== String(prodId));
    guardarCarrito();

    // Notificación Toast tras eliminar
    if (typeof mostrarToast === "function") {
      mostrarToast(`"${nombreItem}" eliminado de tu lista de compra.`, "danger");
    }
  }
}

/**
 * Vacía por completo el carrito de compras.
 * @param {boolean} pedirConfirmacion
 */
function vaciarCarrito(pedirConfirmacion = false) {
  if (carritoCompras.length === 0) return;

  if (pedirConfirmacion) {
    if (!confirm("¿Estás seguro/a de que deseas vaciar todos los juegos del carrito?")) {
      return;
    }
  }

  carritoCompras = [];
  guardarCarrito();

  if (typeof mostrarToast === "function") {
    mostrarToast("El carrito de compras ha sido vaciado.", "info");
  }
}

/**
 * Procesa la finalización de compra y limpia el carrito.
 */
function iniciarCheckout() {
  if (carritoCompras.length === 0) {
    if (typeof mostrarToast === "function") {
      mostrarToast("Tu carrito está vacío. Agrega juegos para continuar.", "warning");
    }
    return;
  }

  const totalJuegos = carritoCompras.reduce((acc, item) => acc + item.cantidad, 0);
  alert(`¡Gracias por tu compra en EriGamesStore!\nHas adquirido ${totalJuegos} videojuego(s). Te contactaremos para coordinar la entrega.`);

  vaciarCarrito(false);

  const offcanvasEl = document.getElementById("offcanvasCarrito");
  if (offcanvasEl && typeof bootstrap !== "undefined") {
    const modal = bootstrap.Offcanvas.getInstance(offcanvasEl);
    if (modal) modal.hide();
  }
}

// ==============================================================================
// 3. MANIPULACIÓN DEL DOM: ACTUALIZACIÓN DE OFFCANVAS Y ÁREA DESIGNADA
// ==============================================================================

/**
 * Actualiza la interfaz visual del carrito en todas sus áreas:
 * 1. Badge numérico del menú.
 * 2. Panel lateral Offcanvas de Bootstrap.
 * 3. Área designada en el cuerpo de la página principal (#contenedor-resumen-pagina).
 */
function actualizarVistaCarrito() {
  const badgeContador = document.getElementById("badge-contador-carrito");
  const areaResumenOffcanvas = document.getElementById("area-resumen-carrito");
  const totalElOffcanvas = document.getElementById("total-carrito");

  // Cálculo de totales
  const totalCantidad = carritoCompras.reduce((acc, item) => acc + item.cantidad, 0);
  const totalPrecio = carritoCompras.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

  // Actualizar badge en barra de navegación
  document.querySelectorAll(".badge-contador-movil, #badge-contador-carrito").forEach((b) => {
    b.textContent = totalCantidad;
  });

  // Actualizar total en Offcanvas
  if (totalElOffcanvas) {
    totalElOffcanvas.textContent = formatearPrecioCLP(totalPrecio);
  }

  // 1. Renderizado en el panel Offcanvas
  if (areaResumenOffcanvas) {
    if (carritoCompras.length === 0) {
      areaResumenOffcanvas.innerHTML = `
        <div style="text-align: center; padding: 2.5rem 1rem; color: var(--text-muted);">
          <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">🛒</div>
          <p style="margin-bottom: 0.25rem; font-weight: 600;">Tu carrito está vacío.</p>
          <small style="color: var(--text-muted);">Añade títulos desde el catálogo para comenzar.</small>
        </div>
      `;
    } else {
      areaResumenOffcanvas.innerHTML = "";

      carritoCompras.forEach((item) => {
        const cardItem = document.createElement("div");
        cardItem.className = "cart-item-card";

        cardItem.innerHTML = `
          <img src="${item.imagen}" alt="${item.nombre}" class="cart-item-img" onerror="if(this.src.includes('/img/')&&!this.src.includes('/assets/img/')){this.src=this.src.replace('/img/','/assets/img/');}">
          <div class="cart-item-details">
            <h6 class="cart-item-title">${item.nombre}</h6>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 4px;">
              <span class="cart-item-price">${formatearPrecioCLP(item.precio)}</span>
              <div style="display: flex; align-items: center; gap: 4px;">
                <button type="button" class="btn btn-sm btn-outline-secondary btn-restar-qty" data-id="${item.id}" aria-label="Disminuir cantidad" style="padding: 0 6px; font-size: 0.75rem; color: #fff;">-</button>
                <span style="font-size: 0.8rem; font-weight: 700; padding: 0 4px;">${item.cantidad}</span>
                <button type="button" class="btn btn-sm btn-outline-secondary btn-sumar-qty" data-id="${item.id}" aria-label="Aumentar cantidad" style="padding: 0 6px; font-size: 0.75rem; color: #fff;">+</button>
              </div>
            </div>
          </div>
          <button type="button" class="btn-eliminar-item" data-id="${item.id}" title="Eliminar del carrito" aria-label="Eliminar ${item.nombre}" style="background: transparent; border: none; color: var(--accent-red); font-size: 1rem; cursor: pointer; padding: 4px;">
            ✖
          </button>
        `;

        cardItem.querySelector(".btn-restar-qty").addEventListener("click", () => modificarCantidadCarrito(item.id, -1));
        cardItem.querySelector(".btn-sumar-qty").addEventListener("click", () => modificarCantidadCarrito(item.id, 1));
        cardItem.querySelector(".btn-eliminar-item").addEventListener("click", () => eliminarDelCarrito(item.id));

        areaResumenOffcanvas.appendChild(cardItem);
      });
    }
  }

  // 2. Renderizado en el Área Designada de la Página Principal (#contenedor-resumen-pagina)
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

      // Conexión de eventos a los botones de la tabla en página
      const btnVaciar = resumenPagina.querySelector("#btn-vaciar-pagina");
      if (btnVaciar) {
        btnVaciar.addEventListener("click", () => vaciarCarrito(true));
      }

      const btnCheckout = resumenPagina.querySelector("#btn-checkout-pagina");
      if (btnCheckout) {
        btnCheckout.addEventListener("click", iniciarCheckout);
      }

      resumenPagina.querySelectorAll(".btn-restar-qty").forEach((btn) => {
        btn.addEventListener("click", () => modificarCantidadCarrito(btn.dataset.id, -1));
      });

      resumenPagina.querySelectorAll(".btn-sumar-qty").forEach((btn) => {
        btn.addEventListener("click", () => modificarCantidadCarrito(btn.dataset.id, 1));
      });

      resumenPagina.querySelectorAll(".btn-eliminar-fila").forEach((btn) => {
        btn.addEventListener("click", () => eliminarDelCarrito(btn.dataset.id));
      });
    }
  }
}

// ==============================================================================
// 4. INICIALIZACIÓN DE EVENTOS DEL CARRITO
// ==============================================================================
document.addEventListener("DOMContentLoaded", () => {
  inicializarCarrito();

  // Botón "Vaciar Carrito" en Offcanvas
  const btnVaciarOffcanvas = document.getElementById("btn-vaciar-carrito");
  if (btnVaciarOffcanvas) {
    btnVaciarOffcanvas.addEventListener("click", () => vaciarCarrito(true));
  }

  // Botón "Finalizar Compra" en Offcanvas
  const btnFinalizarOffcanvas = document.getElementById("btn-finalizar-compra");
  if (btnFinalizarOffcanvas) {
    btnFinalizarOffcanvas.addEventListener("click", iniciarCheckout);
  }
});
