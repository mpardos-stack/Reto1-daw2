<?php
/**
 * GET /api/json/galeria.php?categoria=todos|<estilo>
 * Categorías disponibles y cortes del mural para la vista galeria.html
 */
require_once __DIR__ . '/_comun.php';
require_once __DIR__ . '/../Clases/MuralSugerencia.php';

ejecutarEndpoint(function () {
    $categoria = $_GET['categoria'] ?? 'todos';

    $cortes = ($categoria === 'todos')
        ? MuralSugerencia::obtenerActivas()
        : MuralSugerencia::obtenerPorEstilo($categoria);

    return [
        'categorias' => MuralSugerencia::obtenerCategoriasRecientes(),
        'cortes'     => array_map(function (MuralSugerencia $c) {
            return [
                'nombre'      => $c->getNombreCorte(),
                'descripcion' => $c->getDescripcion(),
                'estilo'      => $c->getEstilo(),
                'imagen_url'  => $c->getImagenUrl(),
            ];
        }, $cortes),
    ];
});
