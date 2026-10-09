/**
 * galeria.html — mural de estilos desde /api/json/galeria.php
 * La categoría elegida va en la URL: galeria.html?categoria=degradado
 */
App.esperar((async () => {
    const lista = document.getElementById('categorias-lista');
    const grid = document.getElementById('galeria-grid');
    const actual = new URLSearchParams(location.search).get('categoria') || 'todos';

    function enlaceCategoria(valor, texto) {
        const li = document.createElement('li');
        const a = App.crear('a', valor.toLowerCase() === actual.toLowerCase() ? 'active' : '', texto);
        a.href = './galeria.html?categoria=' + encodeURIComponent(valor.toLowerCase());
        li.appendChild(a);
        return li;
    }

    try {
        const datos = await App.json('galeria.php?categoria=' + encodeURIComponent(actual));

        lista.appendChild(enlaceCategoria('todos', 'TODOS'));
        datos.categorias.forEach(cat => lista.appendChild(enlaceCategoria(cat, cat.toUpperCase())));

        if (!datos.cortes.length) {
            const aviso = App.crear('section', 'no-data-msg');
            aviso.appendChild(App.crear('p', 'no-data', 'No hay cortes disponibles en esta categoría.'));
            grid.appendChild(aviso);
            return;
        }

        datos.cortes.forEach(corte => {
            const item = App.crear('section', 'galeria-item');

            const wrapper = App.crear('section', 'image-wrapper');
            const img = document.createElement('img');
            img.src = corte.imagen_url;
            img.alt = corte.nombre || '';
            const overlay = App.crear('section', 'overlay');
            overlay.appendChild(App.crear('span', 'tag-estilo', corte.estilo || ''));
            wrapper.append(img, overlay);

            const info = App.crear('section', 'item-info');
            info.appendChild(App.crear('h3', '', corte.nombre || ''));
            info.appendChild(App.crear('p', '', corte.descripcion || ''));

            item.append(wrapper, info);
            grid.appendChild(item);
        });
    } catch (error) {
        console.error('Error al cargar la galería:', error);
        App.mostrarError(grid, 'No se pudo cargar la galería. Inténtalo más tarde.');
    }
})());
