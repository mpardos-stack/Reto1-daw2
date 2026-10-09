/**
 * layout.js — común a todas las vistas públicas (.html)
 *
 * Sustituye a lo que antes hacía PHP en las vistas:
 *  - include_once header.php / footer.php  → carga includes/header.html y footer.html
 *  - <?= BASE_PATH ?>                       → window.BASE_PATH calculado desde la URL
 *  - htmlspecialchars()                      → App.crear() usa textContent (sin XSS)
 *
 * Orden de carga en cada vista:
 *   1. layout.js
 *   2. el script propio de la vista (equipo.js, servicios.js...), que registra
 *      su carga de datos con App.esperar(promesa)
 *   3. cuando header, footer y datos están pintados, se carga assets/script.js
 *      (menú hamburguesa, cookies, pasos de reserva...) para que encuentre el HTML completo
 */
(function () {
    // Ruta base del proyecto: '/barberia_catracha' en XAMPP, '' en Hostinger
    window.BASE_PATH = location.pathname.split('/api/')[0];

    const tareas = [];
    let avisarScriptCargado;

    const App = {
        // Ruta de assets y de la API relativas a las vistas (api/vistas o api/politicaweb)
        rutaJSON: '../json/',

        /** Pide un endpoint JSON y devuelve los datos ya parseados */
        async json(endpoint, opciones) {
            const respuesta = await fetch(App.rutaJSON + endpoint, opciones);
            let datos = null;
            try { datos = await respuesta.json(); } catch (e) { /* respuesta no JSON */ }
            if (!respuesta.ok && !(datos && 'ok' in datos)) {
                throw new Error((datos && datos.error) || ('HTTP ' + respuesta.status));
            }
            return datos;
        },

        /** Crea un elemento con clase y texto seguro (equivale a htmlspecialchars) */
        crear(etiqueta, clase, texto) {
            const el = document.createElement(etiqueta);
            if (clase) el.className = clase;
            if (texto !== undefined && texto !== null) el.textContent = texto;
            return el;
        },

        /** Muestra un mensaje de error dentro de un contenedor */
        mostrarError(contenedor, mensaje) {
            contenedor.replaceChildren(App.crear('p', 'no-data', mensaje || 'No se pudieron cargar los datos. Inténtalo más tarde.'));
        },

        /** Las vistas registran aquí la promesa de su carga de datos */
        esperar(promesa) {
            tareas.push(Promise.resolve(promesa).catch(err => console.error(err)));
        },

        /** Se resuelve cuando assets/script.js ya está cargado y activo */
        scriptListo: new Promise(resolve => { avisarScriptCargado = resolve; })
    };
    window.App = App;

    async function cargarParcial(id, ruta) {
        const hueco = document.getElementById(id);
        if (!hueco) return;
        try {
            const respuesta = await fetch(ruta);
            if (respuesta.ok) hueco.outerHTML = await respuesta.text();
        } catch (error) {
            console.error('No se pudo cargar ' + ruta, error);
        }
    }

    function cargarScript(src) {
        return new Promise((resolve, reject) => {
            const s = document.createElement('script');
            s.src = src;
            s.onload = resolve;
            s.onerror = reject;
            document.body.appendChild(s);
        });
    }

    App.esperar(cargarParcial('header', '../includes/header.html'));
    App.esperar(cargarParcial('footer', '../includes/footer.html'));

    // Cuando todos los scripts de la página se han registrado, esperamos a que terminen
    // y cargamos script.js (él mismo vuelve a disparar DOMContentLoaded para inicializarse)
    document.addEventListener('DOMContentLoaded', async () => {
        await Promise.all(tareas);
        await cargarScript('../../assets/script.js');
        avisarScriptCargado();
    }, { once: true });
})();
