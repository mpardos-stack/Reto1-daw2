/**
 * equipo.html — pinta los barberos activos desde /api/json/barberos.php
 */
App.esperar((async () => {
    const grid = document.getElementById('equipo-grid');
    const plantilla = document.getElementById('tpl-barbero');
    const etiquetasPorDefecto = ['FADE', 'CORTE', 'BARBA'];

    try {
        const barberos = await App.json('barberos.php');

        barberos.forEach(barbero => {
            const tarjeta = plantilla.content.cloneNode(true);
            const img = tarjeta.querySelector('img');
            img.src = barbero.foto_url || '../../assets/img/default-avatar.png';
            img.alt = barbero.nombre;

            tarjeta.querySelector('h2').textContent = barbero.nombre;
            tarjeta.querySelector('.rango').textContent = barbero.especialidad || '';
            tarjeta.querySelector('.bio').textContent = barbero.descripcion || '';

            const tags = tarjeta.querySelector('.tags');
            const etiquetas = barbero.etiquetas.length ? barbero.etiquetas : etiquetasPorDefecto;
            etiquetas.forEach(et => tags.appendChild(App.crear('span', '', et.toUpperCase())));

            grid.appendChild(tarjeta);
        });
    } catch (error) {
        console.error('Error al cargar el equipo:', error);
        App.mostrarError(grid, 'No se pudo cargar el equipo. Inténtalo más tarde.');
    }
})());
