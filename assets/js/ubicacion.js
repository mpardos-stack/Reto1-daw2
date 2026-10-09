/**
 * ubicacion.html — dirección, contacto, horarios y mapa desde /api/json/ubicacion.php
 */
App.esperar((async () => {
    const listaHorarios = document.getElementById('ubi-horarios');

    try {
        const datos = await App.json('ubicacion.php');

        document.getElementById('ubi-direccion').textContent = datos.direccion;
        document.getElementById('ubi-telefono').textContent = datos.telefono;
        document.getElementById('ubi-whatsapp').textContent = datos.whatsapp;

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
