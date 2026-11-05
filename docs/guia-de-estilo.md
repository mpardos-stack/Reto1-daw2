# Guía de estilo — Barbería Catracha

Versión actualizada con lo que hay implementado en el frontend (hitos 7, 8 y 9).
Si añades una página nueva, sigue esta guía para que se vea igual que el resto.

## 1. Archivos

| Archivo | Para qué |
|---|---|
| `assets/style.css` | Hoja principal (tema oscuro). Todas las vistas la cargan. |
| `assets/tema-claro.css` | Hoja alternativa. Solo actúa con `<html data-tema="claro">`. |
| `assets/js/tema.js` | Cambia de tema y lo recuerda (localStorage). Va en el `<head>`. |
| `assets/practica-inline.css` | Solo para la práctica de inline vs externo. |

Orden en el `<head>` de cada vista:

```html
<link rel="stylesheet" href="../../assets/style.css">
<link rel="stylesheet" href="../../assets/tema-claro.css">
<script src="../../assets/js/tema.js"></script>
```

## 2. Colores (variables en `:root`)

| Variable | Tema oscuro | Tema claro | Uso |
|---|---|---|---|
| `--dark-bg` | `#0a0a0a` | `#f7f3ec` | Fondo de las secciones |
| `--white` | `#ffffff` | `#1c1a17` | Texto principal |
| `--gray-text` | `#b3b3b3` | `#4f4a42` | Texto secundario |
| `--gold` | `#d4af37` | `#7a5a00` | Marca: títulos pequeños, botones, precios |
| `--gold-dark` | `#b8860b` | `#5c4300` | Hover de botones dorados |
| `--dark-card` | `#111111` | `#ffffff` | Fondo de tarjetas |
| `--focus` | `#ffd65c` | `#1a56db` | Anillo de foco del teclado |
| `--error` | `#ff6b6b` | `#b3261e` | Texto y borde de los avisos de error |

Reglas:
- No escribir colores a mano en reglas nuevas: usar las variables. Así el tema claro funciona solo.
- Texto normal: contraste mínimo 4,5:1. Texto grande (24px o 18,6px en negrita): 3:1.
- En el tema claro los botones dorados llevan texto **blanco** (negro sobre `#7a5a00` da 3,5:1 y no llega).
- Texto encima de fotos (hero del inicio, fichas del equipo, cabecera legal): siempre blanco en los dos temas.

## 3. Tipografía

- Fuente: Montserrat (con `sans-serif` de reserva). Servicios usa Poppins.
- Títulos de página: `.titulo-principal` (4rem; en móvil `clamp(2rem, 9vw, 2.6rem)`).
- Antetítulo dorado: `.subtitle` / `.section-subtitle` (mayúsculas, espaciado de letras amplio).
- Un solo `<h1>` por página y sin saltar niveles (h1 → h2 → h3). Los títulos del footer son `<h2>`.

## 4. Tamaños de pantalla (breakpoints)

| Ancho | Qué cambia |
|---|---|
| ≤ 360px | En el header solo se ve el logo (sin texto). |
| ≤ 480px | En el header se oculta la palabra "BARBERÍA". |
| ≤ 600px | Rejillas a 1 columna, títulos con `clamp()`. |
| ≤ 768px | Formulario de reservas a 1 columna, se ocultan los nombres de los pasos y aparece "Paso X de 5". |
| ≤ 1199px | Menú de escritorio oculto → botón **MENÚ ☰**. (Antes era 1024px, pero entre 1025 y 1199px no cabía.) |
| ≥ 1200px | Menú completo en el header. |

Técnicas: Flexbox para header, botones y filas; Grid para rejillas de tarjetas
(`repeat(auto-fit, minmax(min(450px, 100%), 1fr))` para que nunca desborde); `clamp()` para títulos.

## 5. Componentes y clases

### Botones
| Clase | Dónde | Estados |
|---|---|---|
| `.btn-reserve` | Header | hover: más claro y escala 1.05 |
| `.btn-reservas` / `.btn-servicios` | Hero del inicio | dorado relleno / borde blanco |
| `.btn-reservar-equipo`, `.btn-reserva-premium`, `.blog-btn` | Llamadas a reservar | hover |
| `.btn-siguiente` / `.btn-atras` / `.btn-confirmar` | Reservas | `.deshabilitado` + `aria-disabled="true"` |
| `.btn-traducir`, `.btn-tema` | Header | `aria-pressed` en el de tema |
| `.filtro-btn` | Filtros de reservas | `.activo` + `aria-pressed="true"` |
| `.hora-item` | Horas de reservas | `.selected` + `aria-pressed="true"` |

**Botón deshabilitado:** no usar el atributo `disabled` en "Siguiente". Se pone `.deshabilitado`
(gris) y `aria-disabled="true"`; al pulsarlo sale un `.aviso-paso` explicando qué falta.

### Tarjetas
- `.explore-card` (inicio), `.barbero-card` (equipo), `.galeria-item`, `.blog-card`, `.categoria-bloque` (servicios).
- `.card-option` (reservas): el `<input type="radio">` va **dentro** del `<label>`, oculto solo a la vista.
  Cuando el radio tiene el foco, la tarjeta muestra el anillo (`:has(input:focus-visible)`).
  Para ocultar una tarjeta se usa el atributo `hidden` (hay regla `.card-option[hidden]`).

### Formularios
- Cada campo: `<label for="id">` + `<input id="id">`. Nunca solo el placeholder.
- Añadir `autocomplete` (`given-name`, `family-name`, `tel`, `email`).
- Ayudas debajo con `.campo-ayuda` y unidas con `aria-describedby`.
- Errores con `<p class="aviso-paso" role="alert" hidden>`: borde y texto rojo + icono ⚠ (no solo color).

### Navegación
- `.nav-menu` (escritorio) y `.hamburger-menu` (móvil). La página actual lleva `aria-current="page"`
  (la pone `layout.js`) y se ve dorada y subrayada.
- El botón MENÚ usa `aria-expanded`. Escape cierra el menú.
- Primer elemento de cada página: `.skip-link` "Saltar al contenido" → `<main id="contenido">`.

### Utilidades
- `.sr-only`: texto que solo lee el lector de pantalla (p. ej. "(se abre en otra pestaña)").
- `.enlace-en-linea`: enlace dentro de un párrafo (dorado y subrayado).
- `.underline`: línea dorada decorativa bajo los títulos. Siempre `<span class="underline" aria-hidden="true">`.

## 6. Estados de foco

Regla global: `:focus-visible { outline: 3px solid var(--focus); outline-offset: 3px; }`.
Solo aparece al usar el teclado. No poner `outline: none` sin dar otra señal visible.

## 7. Tema alternativo (claro)

- Se activa con el botón ☀/☾ del header o con `?tema=claro` en la URL.
- Todas las reglas de `tema-claro.css` empiezan por `html[data-tema="claro"]`: ganan por especificidad,
  sin `!important`.
- Si creas un componente nuevo con las variables de la sección 2, no hace falta tocar `tema-claro.css`.
  Si le pones un color fijo, tendrás que añadir su versión clara.

## 8. Imágenes

- Toda `<img>` lleva `alt`. Si es decorativa o el texto ya está al lado: `alt=""`.
- Fotos de cortes: `alt="Corte Fade medio"`. Fotos de barberos: `alt="Foto de Ross"`.
- Imágenes que no están arriba del todo: `loading="lazy"`.
- Iconos de Font Awesome y emojis decorativos: `aria-hidden="true"`.

## 9. Cambios respecto a la versión anterior

| Antes | Ahora | Motivo |
|---|---|---|
| Dos `:root` con distinto `--gold` | Un solo `:root` con `#d4af37` | El segundo pisaba al primero sin que se notara |
| Solo tema oscuro | Tema claro alternativo con el mismo HTML | CE2D / CE2I |
| Footer con `<h4>` | `<h2>` con el mismo tamaño | No saltar niveles de encabezado |
| `display: inline !important` en el login del footer | Selector más específico | Evitar `!important` |
| `.item-info h3` compartido entre galería y servicios | `.item-row .item-info h3` en servicios | Un estilo pisaba al otro |
| Header y tarjetas con estilos inline desde JS | Clases `.header-scroll`, `.por-revelar`, `.revelada` | El tema no podía cambiarlos |
| Radios con `display: none` | Ocultos solo a la vista + foco en la tarjeta | Se podía reservar solo con ratón |
| `alert()` en reservas | `.aviso-paso` dentro del paso | No bloquea y el mensaje se queda visible |
| Menú visible desde 1025px | Desde 1200px | No cabía y se salía por la derecha |
