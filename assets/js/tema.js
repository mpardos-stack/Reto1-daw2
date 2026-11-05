/**
 * tema.js — cambio entre el tema principal (oscuro) y el alternativo (claro)
 *
 * Cómo funciona:
 *  - El HTML es siempre el mismo. Solo cambiamos el atributo data-tema de <html>.
 *  - assets/tema-claro.css tiene todas sus reglas dentro de html[data-tema="claro"],
 *    así que sin ese atributo no se aplica nada y se ve el tema oscuro de siempre.
 *  - La elección se guarda en localStorage para que se mantenga al cambiar de página.
 *  - También se puede forzar con la URL: ?tema=claro o ?tema=oscuro (útil para probar).
 *
 * Este archivo se carga en el <head> (sin defer) para poner el tema ANTES de que se pinte
 * la página. Si se cargara al final se vería un parpadeo oscuro → claro.
 */
(function () {
    const CLAVE = 'barberia_tema';
    const raiz = document.documentElement;

    // localStorage puede fallar (modo privado, cookies bloqueadas...), por eso el try/catch
    function leerTema() {
        const deLaUrl = new URLSearchParams(location.search).get('tema');
        if (deLaUrl === 'claro' || deLaUrl === 'oscuro') return deLaUrl;
        try { return localStorage.getItem(CLAVE) || 'oscuro'; } catch (e) { return 'oscuro'; }
    }

    function guardarTema(tema) {
        try { localStorage.setItem(CLAVE, tema); } catch (e) { /* no pasa nada, solo no se recuerda */ }
    }

    function aplicarTema(tema) {
        if (tema === 'claro') {
            raiz.setAttribute('data-tema', 'claro');
        } else {
            raiz.removeAttribute('data-tema');
        }
        actualizarBoton(tema);
    }

    // El botón está en header.html, que se carga después (layout.js), así que puede no existir aún
    function actualizarBoton(tema) {
        const boton = document.getElementById('btn-tema');
        if (!boton) return;
        const esClaro = tema === 'claro';
        boton.setAttribute('aria-pressed', esClaro ? 'true' : 'false');
        boton.setAttribute('aria-label', esClaro ? 'Volver al tema oscuro' : 'Activar tema claro');
        boton.querySelector('span').textContent = esClaro ? '☾' : '☀';
    }

    // 1) Nada más cargar: aplicamos el tema guardado
    aplicarTema(leerTema());

    // 2) Delegación de eventos: escuchamos en document porque el botón llega más tarde
    document.addEventListener('click', function (e) {
        const boton = e.target.closest('#btn-tema');
        if (!boton) return;
        const nuevo = raiz.getAttribute('data-tema') === 'claro' ? 'oscuro' : 'claro';
        aplicarTema(nuevo);
        guardarTema(nuevo);
    });

    // 3) Cuando layout.js termina de meter el header, ponemos bien el texto del botón
    if (window.App && App.scriptListo) {
        App.scriptListo.then(() => actualizarBoton(leerTema()));
    } else {
        document.addEventListener('DOMContentLoaded', () => {
            // layout.js crea window.App al final del body; esperamos a que esté listo
            if (window.App) App.scriptListo.then(() => actualizarBoton(leerTema()));
        });
    }
})();
