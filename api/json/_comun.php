<?php
/**
 * Utilidades comunes de los endpoints JSON
 * Cada endpoint de esta carpeta devuelve SOLO JSON (las vistas .html lo consumen con fetch)
 */

require_once __DIR__ . '/../Clases/BD.php';

// Cualquier aviso/echo accidental se captura para no romper el JSON
ob_start();
ini_set('display_errors', '0');

/**
 * Envía la respuesta en JSON y termina la ejecución
 */
function responderJSON($datos, int $codigo = 200): void {
    ob_end_clean();
    http_response_code($codigo);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    echo json_encode($datos, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

/**
 * Ejecuta la función que obtiene los datos y responde con error 500 si algo falla
 */
function ejecutarEndpoint(callable $obtenerDatos): void {
    try {
        responderJSON($obtenerDatos());
    } catch (Throwable $e) {
        error_log('[api/json] ' . $e->getMessage());
        responderJSON(['error' => 'No se pudieron cargar los datos'], 500);
    }
}
