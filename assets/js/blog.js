/**
 * blog.html — publicaciones desde /api/json/blog.php
 */
App.esperar((async () => {
    const grid = document.getElementById('blog-grid');

    try {
        const posts = await App.json('blog.php');
        let hayInstagram = false;

        posts.forEach(post => {
            const card = App.crear('article', 'blog-card');

            // MEDIA: embed de Instagram, imagen o imagen por defecto
            const media = App.crear('section', 'blog-media');
            if (post.instagram_embed) {
                const wrapper = App.crear('section', 'instagram-wrapper');
                // HTML introducido por el administrador desde el panel (igual que antes con PHP)
                wrapper.innerHTML = post.instagram_embed;
                media.appendChild(wrapper);
                hayInstagram = true;
            } else {
                const img = document.createElement('img');
                img.src = post.imagen_url || '../../assets/img/blog/default.jpg';
                img.alt = post.imagen_url ? post.titulo : 'Blog Barbería Catracha';
                media.appendChild(img);
            }

            // INFO
            const info = App.crear('section', 'blog-info');
            info.appendChild(App.crear('span', 'blog-tag', post.etiquetas));
            info.appendChild(App.crear('h2', '', post.titulo));
            info.appendChild(App.crear('p', '', post.resumen + '...'));
            const btn = App.crear('a', 'blog-btn', 'RESERVA CITA');
            btn.href = 'reservas.html';
            info.appendChild(btn);

            card.append(media, info);
            grid.appendChild(card);
        });

        // Los <script> dentro de innerHTML no se ejecutan: cargamos el script de Instagram aparte
        if (hayInstagram) {
            const s = document.createElement('script');
            s.async = true;
            s.src = 'https://www.instagram.com/embed.js';
            s.onload = () => window.instgrm && window.instgrm.Embeds.process();
            document.body.appendChild(s);
        }
    } catch (error) {
        console.error('Error al cargar el blog:', error);
        App.mostrarError(grid, 'No se pudo cargar el blog. Inténtalo más tarde.');
    }
})());
