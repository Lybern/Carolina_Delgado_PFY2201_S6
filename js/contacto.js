/**
 * ==============================================================================
 * ARCHIVO: js/contacto.js
 * PROYECTO: EriGamesStore - Formulario de Contacto
 * DESARROLLADO POR: Carolina Delgado
 * DESCRIPCIÓN: Módulo de validación interactiva del formulario de contacto.
 *              Implementa validación en tiempo real (input / change),
 *              control de longitud máxima, prevención de envío (preventDefault)
 *              y retroalimentación mediante clases nativas de Bootstrap 5
 *              (is-valid, is-invalid, invalid-feedback) sin interrupciones.
 * ==============================================================================
 */

"use strict";

/**
 * Aplica o remueve las clases visuales de validación de Bootstrap 5 en un campo.
 * @param {HTMLElement} campo - Elemento del DOM (input, select, textarea).
 * @param {boolean} condicion - Verdadero si cumple la validación; falso si no.
 * @returns {boolean} La misma condición evaluada.
 */
const validarCampo = (campo, condicion) => {
  if (!campo) return false;
  campo.classList.toggle("is-valid", condicion);
  campo.classList.toggle("is-invalid", !condicion);
  return condicion;
};

/**
 * Valida todos los campos del formulario según las reglas de negocio.
 * @returns {boolean} Verdadero si todo el formulario es válido.
 */
const validarFormularioContacto = () => {
  const inputNombre = document.getElementById("nombre");
  const inputEmail = document.getElementById("email");
  const selectMotivo = document.getElementById("motivo");
  const textareaMensaje = document.getElementById("mensaje");

  if (!inputNombre || !inputEmail || !selectMotivo || !textareaMensaje) {
    return false;
  }

  // Expresión regular para validación rigurosa de correo electrónico
  const erEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // 1. Validación de Nombre (no vacío, mín 3 caracteres, máx 80)
  const valNombre = inputNombre.value.trim();
  const nombreValido = validarCampo(
    inputNombre,
    valNombre !== "" && valNombre.length >= 3 && valNombre.length <= 80
  );

  // 2. Validación de Correo Electrónico
  const valEmail = inputEmail.value.trim();
  const emailValido = validarCampo(
    inputEmail,
    valEmail !== "" && erEmail.test(valEmail) && valEmail.length <= 100
  );

  // 3. Validación de Motivo de Consulta (debe seleccionar una opción válida)
  const motivoValido = validarCampo(
    selectMotivo,
    selectMotivo.value !== "" && selectMotivo.value !== null
  );

  // 4. Validación de Mensaje (no vacío, mín 10 caracteres, máx 300)
  const valMensaje = textareaMensaje.value.trim();
  const mensajeValido = validarCampo(
    textareaMensaje,
    valMensaje !== "" && valMensaje.length >= 10 && valMensaje.length <= 300
  );

  return nombreValido && emailValido && motivoValido && mensajeValido;
};

/**
 * Limpia todas las clases de validación de Bootstrap en los campos.
 */
const limpiarValidacionesFormulario = () => {
  const campos = document.querySelectorAll("#form_contacto .form-control, #form_contacto .form-select");
  campos.forEach((campo) => {
    campo.classList.remove("is-valid", "is-invalid");
  });
};

// ==============================================================================
// GESTIÓN DE EVENTOS DEL FORMULARIO DE CONTACTO
// ==============================================================================
document.addEventListener("DOMContentLoaded", () => {
  const formulario = document.getElementById("form_contacto");
  if (!formulario) return;

  const inputNombre = document.getElementById("nombre");
  const inputEmail = document.getElementById("email");
  const selectMotivo = document.getElementById("motivo");
  const textareaMensaje = document.getElementById("mensaje");
  const divEstado = document.getElementById("mensaje_estado");

  // Validación reactiva en tiempo real mientras el usuario escribe o cambia campos
  [inputNombre, inputEmail, selectMotivo, textareaMensaje].forEach((campo) => {
    if (!campo) return;
    campo.addEventListener("input", () => {
      // Si el campo ya tiene clase de error o éxito, validarlo en caliente
      if (campo.classList.contains("is-invalid") || campo.classList.contains("is-valid")) {
        validarFormularioContacto();
      }
    });
    campo.addEventListener("change", validarFormularioContacto);
  });

  // Intercepción del evento submit para validación previa sin alert
  formulario.addEventListener("submit", (event) => {
    event.preventDefault(); // Prevenir envío sincrónico y recarga

    const esValido = validarFormularioContacto();

    if (!esValido) {
      // Retroalimentación visual inline (NO alert)
      if (divEstado) {
        divEstado.style.display = "block";
        divEstado.style.backgroundColor = "rgba(239, 68, 68, 0.15)";
        divEstado.style.border = "1px solid var(--accent-red)";
        divEstado.style.color = "#fca5a5";
        divEstado.textContent = "Por favor, completa correctamente todos los campos obligatorios indicados en rojo.";
      }

      if (typeof mostrarToast === "function") {
        mostrarToast("Corrige los campos destacados antes de enviar.", "warning");
      }
      return;
    }

    // Proceso exitoso de envío
    const nombreCliente = inputNombre.value.trim();
    if (divEstado) {
      divEstado.style.display = "block";
      divEstado.style.backgroundColor = "rgba(16, 185, 129, 0.15)";
      divEstado.style.border = "1px solid var(--accent-green)";
      divEstado.style.color = "#86efac";
      divEstado.textContent = `¡Gracias por contactarnos, ${nombreCliente}! Hemos recibido tu consulta y un asesor gamer te responderá a la brevedad.`;
    }

    if (typeof mostrarToast === "function") {
      mostrarToast(`¡Consulta enviada con éxito! Gracias, ${nombreCliente}.`, "success");
    }

    // Reiniciar formulario y clases de validación
    formulario.reset();
    limpiarValidacionesFormulario();

    setTimeout(() => {
      if (divEstado) divEstado.style.display = "none";
    }, 6000);
  });
});
