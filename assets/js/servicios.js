/**
 * servicios.html — lista de precios agrupada por categoría desde /api/json/servicios.php
 */
App.esperar((async () => {
    const contenedor = document.getElementById('servicios-bloques');

    // Avisos especiales que antes estaban escritos en la vista PHP
    const avisos = {
        'Tinte de colores': '(SOLO LUN, MAR Y MIÉ)',
        'Permanente': '(LUN A MIÉ)'
    };

    try {
        const servicios = await App.json('servicios.php');

        // Agrupar por categoría manteniendo el orden en que llegan
        const bloques = {};
        servicios.forEach(s => (bloques[s.categoria] = bloques[s.categoria] || []).push(s));

        Object.entries(bloques).forEach(([categoria, lista]) => {
            const bloque = App.crear('section', 'categoria-bloque');
            bloque.appendChild(App.crear('h2', 'categoria-nombre', categoria.replace(/_/g, ' ').toUpperCase()));

            const items = App.crear('nav', 'items-list');
            lista.forEach(s => {
                const fila = App.crear('article', 'item-row');

                const info = App.crear('header', 'item-info');
                const h3 = App.crear('h3', '', s.nombre.toUpperCase());
                if (avisos[s.nombre]) {
                    h3.append(' ');
                    h3.appendChild(App.crear('small', '', avisos[s.nombre]));
                }
                info.appendChild(h3);
                info.appendChild(App.crear('p', 'descripcion', s.descripcion || ''));

                const precio = App.crear('aside', 'item-precio');
                precio.appendChild(App.crear('span', '', `${Number(s.precio).toFixed(2)}€ / ${s.duracion} MIN`));

                fila.append(info, precio);
                items.appendChild(fila);
            });

            bloque.appendChild(items);
            contenedor.appendChild(bloque);
        });
    } catch (error) {
        console.error('Error al cargar los servicios:', error);
        App.mostrarError(contenedor, 'No se pudieron cargar los servicios. Inténtalo más tarde.');
    }
})());
