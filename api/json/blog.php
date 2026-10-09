<?php
/**
 * GET /api/json/blog.php
 * Publicaciones del blog para la vista blog.html
 */
require_once __DIR__ . '/_comun.php';
require_once __DIR__ . '/../Clases/BlogPost.php';

ejecutarEndpoint(function () {
    return array_map(function (BlogPost $p) {
        $texto = trim(strip_tags($p->getContenido()));

        return [
            'titulo'          => $p->getTitulo(),
            'resumen'         => mb_substr($texto, 0, 140),
            'etiquetas'       => $p->getEtiquetas() ?: 'BARBERÍA',
            'imagen_url'      => $p->getImagenUrl(),
            // HTML del embed de Instagram (lo introduce el administrador desde el panel)
            'instagram_embed' => $p->getInstagramEmbed() ?: null,
            'fecha'           => $p->getFechaPublicacion(),
        ];
    }, BlogPost::obtenerTodos());
});
