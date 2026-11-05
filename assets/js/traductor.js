// Botón que traduce la página al inglés opcion 1
const boton = document.getElementById('btn-traducir');

boton.addEventListener('click', async () => {

    // Si ya está en inglés, recargamos la página y vuelve al español
    if (boton.textContent === 'ES') {
        location.reload();
        return;
    }

    boton.textContent = '...';
    boton.setAttribute('aria-busy', 'true'); // "ocupado" mientras traduce

    // Recorremos todos los textos de la página uno a uno
    const recorrido = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);

    while (recorrido.nextNode()) {
        const nodo = recorrido.currentNode;
        const texto = nodo.nodeValue.trim();

        // Saltamos los textos vacíos y el código de <script> y <style>
        if (texto === '' || ['SCRIPT', 'STYLE'].includes(nodo.parentElement.tagName)) continue;

        // Cambiamos el texto por su traducción
        nodo.nodeValue = ' ' + await traducir(texto) + ' ';
    }

    boton.textContent = 'ES';
    boton.removeAttribute('aria-busy');
    boton.setAttribute('aria-label', 'Volver a ver la página en español');

    // Cambiamos el idioma del documento: así el lector de pantalla lee el texto
    // con voz inglesa y no con la española (criterio WCAG 3.1.1)
    document.documentElement.lang = 'en';
});

// Envía un texto al traductor de Google y devuelve la traducción en inglés
async function traducir(texto) {
    const url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=es&tl=en&dt=t&q='
        + encodeURIComponent(texto);

    const respuesta = await fetch(url);
    const datos = await respuesta.json();

    return datos[0].map(frase => frase[0]).join('');
}
