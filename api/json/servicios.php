<?php
/**
 * GET /api/json/servicios.php
 * Lista de servicios para la vista servicios.html
 */
require_once __DIR__ . '/_comun.php';
require_once __DIR__ . '/../Clases/Servicio.php';

ejecutarEndpoint(function () {
    return array_map(function (Servicio $s) {
        return [
            'id'          => $s->getServicioId(),
            'nombre'      => $s->getNombre(),
            'descripcion' => $s->getDescripcion(),
            'precio'      => $s->getPrecio(),
            'duracion'    => $s->getDuracionMinutos(),
            'categoria'   => $s->getCategoria() ?: 'otros',
        ];
    }, Servicio::obtenerTodos());
});
