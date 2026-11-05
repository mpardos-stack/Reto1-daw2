/**
 * ubicacion.html — dirección, contacto, horarios y mapa desde /api/json/ubicacion.php
 */
App.esperar((async () => {
    const listaHorarios = document.getElementById('ubi-horarios');

    try {
        const datos = await App.json('ubicacion.php');

        document.getElementById('ubi-direccion').textContent = datos.direccion;
        // Teléfono y WhatsApp como enlaces: en el móvil se llama o se abre el chat con un toque
        const soloCifras = texto => String(texto || '').replace(/\D/g, '');
        const tel = document.getElementById('ubi-telefono');
        tel.textContent = datos.telefono;
        tel.href = 'tel:+34' + soloCifras(datos.telefono);
        const wa = document.getElementById('ubi-whatsapp');
        wa.textContent = datos.whatsapp;
        wa.href = 'https://wa.me/34' + soloCifras(datos.whatsapp);

        // Solo se aceptan mapas de Google para el iframe
        if (/^https:\/\/(www\.)?google\.[a-z.]+\/maps\//.test(datos.mapa_embed)) {
            document.getElementById('ubi-mapa').src = datos.mapa_embed;
        }

        datos.horarios.forEach(h => {
            const li = document.createElement('li');
            li.appendChild(App.crear('span', 'dia', h.dia));
            li.appendChild(App.crear('span', 'horas', h.cerrado ? 'Cerrado' : `${h.apertura} – ${h.cierre}`));
            listaHorarios.appendChild(li);
        });
    } catch (error) {
        console.error('Error al cargar la ubicación:', error);
        App.mostrarError(listaHorarios, 'No se pudieron cargar los horarios.');
    }
})());
