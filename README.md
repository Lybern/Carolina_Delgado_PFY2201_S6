# 🎮 EriGamesStore - Optimizando la Lógica y Rendimiento con JavaScript y Bootstrap 5

**Asignatura:** Desarrollo Frontend I (PFY2201)  
**Institución:** Duoc UC – Escuela de Informática y Telecomunicaciones  
**Evaluación:** Actividad Sumativa – Semana 6 (Experiencia de Aprendizaje 2)  
**Estudiante:** Carolina Delgado  
**Repositorio GitHub:** [https://github.com/Lybern/Carolina_Delgado_PFY2201_S6](https://github.com/Lybern/Carolina_Delgado_PFY2201_S6)  
**Sitio en Vivo (GitHub Pages):** [https://lybern.github.io/Carolina_Delgado_PFY2201_S6/](https://lybern.github.io/Carolina_Delgado_PFY2201_S6/)  

---

## 📌 Descripción General del Proyecto

**EriGamesStore** es una plataforma web de comercio electrónico especializada en videojuegos, consolas y accesorios gamer. 

Durante esta **Semana 6**, el proyecto integró una profunda optimización combinando la potencia de **Bootstrap 5** para la maquetación responsiva y componentes de interfaz con la versatilidad de **JavaScript moderno (ES6+)** para la interactividad, manipulación dinámica del DOM, gestión de eventos y consumo asíncrono de datos mediante **Fetch API**.

---

## 🚀 Características Técnicas Implementadas

### 1. Maquetación y Componentes Responsivos con Bootstrap 5
* **Barra de Navegación Responsiva:** Incorpora menú colapsable para dispositivos móviles con botón hamburguesa (`navbar-toggler`), enlaces con diseño interactivo, menú desplegable con categorías simuladas (*Aventura y Acción*, *Rol (RPG)*, *Deportes*, *Plataformas*, *Survival Horror*) y buscador integrado.
* **Carrusel Hero Accesible:** 3 diapositivas destacadas en alta definición con indicadores, controles y un botón interactivo de **Pausa / Reanudación** (`#btn_pausa_carrusel`) conforme a las directrices de accesibilidad (WCAG 2.1).
* **Panel Lateral Offcanvas para el Carrito:** Despliegue interactivo del resumen de compras sin necesidad de abandonar ni recargar la página.
* **Adaptabilidad Multidispositivo:** Maquetación fluida y probada para pantallas de escritorio, tablets y teléfonos móviles sin desbordamientos horizontales.

### 2. Manipulación Dinámica del DOM y Gestión de Eventos en JavaScript
* **Separación Modular por Responsabilidad:** Código JavaScript estructurado en 3 módulos especializados:
  * `js/dom.js`: Carga dinámica de productos con Fetch API, construcción segura de tarjetas en el DOM con `createElement`/`appendChild`, filtro en tiempo real y componentes interactivos.
  * `js/carrito.js`: Lógica completa de compras con persistencia en `localStorage`, cálculo de totales, renderizado en panel Offcanvas y en el área designada de la página (`#contenedor-resumen-pagina`), y confirmación de eliminación.
  * `js/contacto.js`: Validación semántica de formulario con clases nativas de Bootstrap 5 (`is-valid`, `is-invalid`, `invalid-feedback`), validación en caliente (`input`/`change`) e intercepción de `submit` con `preventDefault()`.
* **Componente Toast de Bootstrap 5:** Notificaciones no invasivas al agregar o eliminar juegos del carrito y ante advertencias del sistema (sin recurrir a molestos `alert()`).
* **Evento `click` (Carrito de Compras):** Cada producto cuenta con un botón interactivo que añade el ítem al carrito, genera retroalimentación visual en el botón (*¡Añadido!*), despliega el panel y actualiza el contador.
* **Evento `submit` (Buscador y Formulario de Contacto):** Interceptación de envíos mediante `event.preventDefault()` para filtrar videojuegos o validar datos de contacto.

### 3. Carga de Datos Asíncrona con Fetch API y `async / await`
* **Consumo de Archivo JSON Local:** Carga asíncrona del catálogo de videojuegos desde `data/productos.json` con manejo estructurado de errores y mensajes amigables vía Toast.
* **Respaldo Automático:** En caso de fallas de red o ejecución directa mediante protocolo `file://`, se activa un catálogo de respaldo en memoria que garantiza la visualización continua.

### 4. Persistencia en el Navegador con `localStorage`
* **Sincronización del Carrito:** Los productos añadidos se almacenan en `localStorage` (`leerCarrito`, `guardarCarrito`, `eliminarDelCarrito`, `vaciarCarrito`), manteniendo los datos entre sesiones.
* **Operaciones Completas:** Aumentar (+), disminuir (-), eliminar y vaciar con cálculo en tiempo real en pesos chilenos (`CLP`).

---

## 📂 Estructura del Proyecto

```plaintext
Carolina_Delgado_PFY2201_S6/
├── index.html                # Página principal del eCommerce con Bootstrap 5
├── styles.css                # Hoja de estilos personalizada con diseño Dark Gamer
├── data/
│   └── productos.json        # Catálogo de videojuegos en formato JSON
├── img/                      # Recursos visuales y carátulas de videojuegos
│   ├── cyberpunk-2077.jpg
│   ├── erigames-logo.jpg
│   ├── fc24.jpg
│   ├── ffvii-rebirth.jpg
│   ├── mario-wonder.jpg
│   ├── resident-evil-4.jpg
│   └── zelda-totk.jpg
├── js/
│   ├── dom.js                # Carga Fetch API, renderizado y eventos de catálogo
│   ├── carrito.js            # Lógica de compras, LocalStorage y resumen DOM
│   ├── contacto.js           # Validación semántica con Bootstrap 5
│   └── scripts.js            # Script unificado de respaldo
└── README.md                 # Documentación técnica completa del proyecto
```

---

## 🛠️ Tecnologías Empleadas

* **HTML5 Semántico:** Estructura limpia y accesible validada con etiquetas `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`.
* **CSS3 Personalizado:** Variables en `:root`, Flexbox, CSS Grid, filtros de desenfoque (`backdrop-filter`) y efectos luminosos.
* **Bootstrap 5.3:** Sistema de rejilla, barra de navegación responsiva, carrusel y panel Offcanvas.
* **JavaScript ES6+:** Funciones flecha, desestructuración, promesas, `async / await`, `AbortController` y `localStorage`.
* **Git & GitHub Pages:** Control de versiones y despliegue público en la nube.
