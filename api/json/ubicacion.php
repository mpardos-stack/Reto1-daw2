<?php
/**
 * GET /api/json/ubicacion.php
 * Datos de contacto y horarios para la vista ubicacion.html
 */
require_once __DIR__ . '/_comun.php';
require_once __DIR__ . '/../Clases/DatosUbicacion.php';
require_once __DIR__ . '/../Clases/Horario.php';

ejecutarEndpoint(function () {
    $datos = DatosUbicacion::obtener() ?: [];

    return [
        'direccion'  => $datos['direccion'] ?? '',
        'telefono'   => $datos['telefono'] ?? '',
        'whatsapp'   => $datos['whatsapp'] ?? '',
        'mapa_embed' => $datos['mapa_embed'] ?? '',
        'horarios'   => array_map(function ($h) {
            return [
                'dia'      => $h['dia_semana'],
                'cerrado'  => !empty($h['cerrado']),
                'apertura' => $h['hora_apertura'] ? substr($h['hora_apertura'], 0, 5) : null,
                'cierre'   => $h['hora_cierre'] ? substr($h['hora_cierre'], 0, 5) : null,
            ];
        }, Horario::obtenerTodos()),
    ];
});
