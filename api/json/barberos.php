<?php
/**
 * GET /api/json/barberos.php
 * Barberos activos para la vista equipo.html
 */
require_once __DIR__ . '/_comun.php';
require_once __DIR__ . '/../Clases/Barbero.php';

ejecutarEndpoint(function () {
    return array_map(function (Barbero $b) {
        // Etiquetas guardadas como texto separado por comas ("Corte, Barba, Estilo")
        $etiquetas = array_values(array_filter(array_map('trim', explode(',', $b->getEtiquetas() ?? ''))));

        return [
            'id'           => $b->getBarberoId(),
            'nombre'       => $b->getNombre(),
            'especialidad' => $b->getEspecialidad(),
            'descripcion'  => $b->getDescripcion(),
            'foto_url'     => $b->getFotoUrl(),
            'etiquetas'    => $etiquetas,
        ];
    }, Barbero::obtenerActivos());
});
