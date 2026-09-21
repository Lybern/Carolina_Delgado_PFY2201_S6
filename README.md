# 🎮 EriGamesStore (EGS) — Plataforma eCommerce Gamer
> **Optimización de Lógica y Rendimiento Frontend con Bootstrap 5, Fetch API y JavaScript Modular**

[![HTML5](https://img.shields.io/badge/HTML5-Semántico-E34F26?logo=html5&logoColor=white)](#)
[![CSS3](https://img.shields.io/badge/CSS3-Modern%20Design-1572B6?logo=css3&logoColor=white)](#)
[![Bootstrap 5.3](https://img.shields.io/badge/Bootstrap-5.3.3-7952B3?logo=bootstrap&logoColor=white)](#)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6%2B%20Modular-F7DF1E?logo=javascript&logoColor=black)](#)
[![Fetch API](https://img.shields.io/badge/Fetch%20API-JSON%20Asíncrono-00f0ff)](#)
[![GitHub Pages](https://img.shields.io/badge/Deploy-GitHub%20Pages-22c55e?logo=github&logoColor=white)](https://lybern.github.io/Carolina_Delgado_PFY2201_S6/)

---

## 📌 Ficha Técnica del Proyecto

* **Institución:** Instituto Profesional Duoc UC — Escuela de Informática y Telecomunicaciones
* **Asignatura:** Desarrollo Frontend I (PFY2201)
* **Evaluación:** Actividad Sumativa — Semana 6 (Experiencia de Aprendizaje 2)
* **Estudiante:** Carolina Delgado
* **Repositorio GitHub Oficial:** [https://github.com/Lybern/Carolina_Delgado_PFY2201_S6](https://github.com/Lybern/Carolina_Delgado_PFY2201_S6)
* **Sitio en Vivo (GitHub Pages):** [https://lybern.github.io/Carolina_Delgado_PFY2201_S6/](https://lybern.github.io/Carolina_Delgado_PFY2201_S6/)

---

##  Arquitectura y Características del Sistema

### 1. Carga Asíncrona con Fetch API y Resiliencia
- **Consumo de Datos Locales:** La función `cargarProductos()` en `assets/js/dom.js` invoca asíncronamente `data/productos.json`.
- **Manejo de Errores:** Se evalúa `respuesta.ok`. En caso de interrupción o protocolo `file://`, se activa la colección `PRODUCTOS_DEFAULT` y se notifica al usuario mediante un Toast visual de advertencia.
- **Formateo Monetario:** Utilización de `Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" })` para formatear precios en moneda chilena (ej. `$54.990 CLP`).

### 2. Persistencia en el Navegador con Web Storage API (`localStorage`)
- **Gestión del Carrito:** Administrado en `assets/js/carrito.js` mediante las funciones `leerCarrito()`, `guardarCarrito()`, `agregarAlCarrito()`, `modificarCantidadCarrito()`, `eliminarDelCarrito()` y `vaciarCarrito()`.
- **Almacenamiento Estructurado:** Los ítems se serializan en formato JSON bajo la clave `carrito_compras_erigames`.
- **Vaciado Limpio:** Se utiliza `localStorage.removeItem("carrito_compras_erigames")` asegurando una limpieza completa de memoria.

### 3. Interacciones y Experiencia de Usuario (UI/UX)
- **Notificaciones No Invasivas (Toast):** Componente Bootstrap 5 ubicado en la esquina inferior izquierda (`bottom-0 start-0`) con temporizador de 2.5s para no obstruir los botones de acción del panel lateral.
- **Microinteracciones Gamer:** Al pasar el cursor sobre los enlaces de navegación, estos transicionan a color naranja neón cálido (`#fb923c`) con resplandor suave y sutil elevación.
- **Feedback Inmediato:** El botón de compra cambia su estado a `✅ ¡Añadido!` temporalmente al hacer click.
- **Formulario de Contacto:** Validación nativa Bootstrap 5 en eventos `input` y `change`, con retroalimentación inmediata mediante clases `is-valid` e `is-invalid`.

### 4. Adaptabilidad y Comprobación en Dispositivo Real
- La aplicación fue sometida a pruebas exhaustivas de diseño responsivo en escritorio y directamente en un smartphone físico **Samsung Galaxy S24 Ultra**, verificando:
  - Despliegue accesible del menú hamburguesa.
  - Zonas táctiles superiores a 44px (*tap targets*).
  - Encabezado con degradado naranja nítido e isotipo circular optimizado.

---

## 📁 Estructura Oficial del Repositorio y Entrega

La distribución de archivos cumple estrictamente con el estándar solicitado:

```text
Carolina_Delgado_PFY2201_S6/
│
├── index.html                      # Maquetación principal semántica y responsiva
├── README.md                       # Documentación técnica y académica completa
├── .gitignore                      # Exclusión de archivos de reporte e instaladores
│
├── data/
│   └── productos.json              # Datos externos de videojuegos para la Fetch API
│
├── assets/
│   ├── css/
│   │   └── styles.css              # Hoja de estilos Dark Gamer con variables CSS
│   ├── js/
│   │   ├── dom.js                  # Fetch API, renderizado dinámico y eventos del catálogo
│   │   ├── carrito.js              # Lógica de compras, localStorage, Offcanvas y tabla
│   │   ├── contacto.js             # Validación nativa Bootstrap 5 del formulario
│   │   └── scripts.js              # Módulo de integración
│   └── img/
│       ├── erigames-cat-icon.png   # Isotipo transparente oficial de la gatita gamer
│       ├── erigames-logo.jpg       # Logotipo de cabecera oficial
│       ├── cyberpunk-2077.jpg      # Portada oficial de videojuego
│       ├── fc24.jpg                # Portada oficial de videojuego
│       ├── ffvii-rebirth.jpg       # Portada oficial de videojuego
│       ├── mario-wonder.jpg        # Portada oficial de videojuego
│       ├── resident-evil-4.jpg     # Portada oficial de videojuego
│       └── zelda-totk.jpg          # Portada oficial de videojuego
│
└── screenshots/                    # Capturas de evidencia para la evaluación
    ├── 01_estructura_general_pagina.png
    ├── 02_carga_fetch_api_catalogo.png
    ├── 03_interaccion_toast_agregar_carrito.png
    ├── 04_interaccion_offcanvas_carrito.png
    ├── 05_interaccion_busqueda_filtrado.png
    ├── 06_resumen_carrito_y_contacto.png
    ├── 07_vista_movil_samsung_s24_ultra.jpeg
    └── 08_evento_hover_cursor_naranja.png
```

---

## 💻 Instrucciones para Ejecución Local

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/Lybern/Carolina_Delgado_PFY2201_S6.git
   cd Carolina_Delgado_PFY2201_S6
   ```

2. **Ejecutar con un servidor local (Recomendado para Fetch API):**
   - Utilizando la extensión **Live Server** de Visual Studio Code (haciendo click derecho en `index.html` -> *Open with Live Server*).
   - O mediante Python en terminal:
     ```bash
     python -m http.server 8000
     ```
     Y abrir en el navegador `http://localhost:8000`.

3. **Ejecución directa en navegador:**
   - Puede abrirse directamente `index.html` con doble click. Gracias a la resiliencia programada, el catálogo cargará automáticamente los datos de respaldo en caso de que las políticas CORS del protocolo `file://` restrinjan la Fetch API.

---

## 🌐 Enlaces de Despliegue y Consulta

* **Repositorio de Código Fuente:** [https://github.com/Lybern/Carolina_Delgado_PFY2201_S6](https://github.com/Lybern/Carolina_Delgado_PFY2201_S6)
* **Despliegue Público Activo:** [https://lybern.github.io/Carolina_Delgado_PFY2201_S6/](https://lybern.github.io/Carolina_Delgado_PFY2201_S6/)

---
*Desarrollado por **Carolina Delgado** — Duoc UC 2026.*
