<?php
/**
 * /api/json/reservas.php
 *   GET  → datos para montar el formulario de reservas.html
 *          (servicios, barberos, horarios y reservas ocupadas)
 *   POST → crea una reserva. Responde { ok: true } o { ok: false, error: "..." }
 */
require_once __DIR__ . '/_comun.php';
require_once __DIR__ . '/../Clases/Barbero.php';
require_once __DIR__ . '/../Clases/Servicio.php';
require_once __DIR__ . '/../Clases/Horario.php';
require_once __DIR__ . '/../Clases/Reserva.php';
require_once __DIR__ . '/../Clases/Cliente.php';
require_once __DIR__ . '/../Notificaciones.php';

// ---------------------------------------------------------------
// POST: crear reserva
// ---------------------------------------------------------------
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $servicioId = $_POST['servicio_id'] ?? null;
        $barberoId  = $_POST['barbero_id'] ?? null;
        $fecha      = $_POST['fecha'] ?? null;
        $hora       = $_POST['hora'] ?? null;
        $nombre     = trim($_POST['nombre'] ?? '');
        $apellido   = trim($_POST['apellido'] ?? '');
        $telefono   = trim($_POST['telefono'] ?? '');
        $email      = trim($_POST['email'] ?? '');

        if (!$servicioId || !$barberoId || !$fecha || !$hora || !$nombre || !$apellido || !$telefono) {
            responderJSON(['ok' => false, 'error' => 'Por favor completa todos los campos obligatorios antes de confirmar tu reserva.'], 422);
        }

        $fechaHora = DateTime::createFromFormat('d/m/Y H:i', "$fecha $hora");
        if (!$fechaHora) {
            responderJSON(['ok' => false, 'error' => 'La fecha u hora seleccionadas no son válidas. Verifica tu selección.'], 422);
        }

        $cliente = new Cliente($nombre, $apellido, $telefono, $email ?: null);
        if (!$cliente->guardar()) {
            responderJSON(['ok' => false, 'error' => 'No se pudo guardar la información del cliente. Por favor, inténtalo de nuevo.'], 500);
        }

        $reserva = new Reserva(
            $cliente->getClienteId(),
            (int)$barberoId,
            (int)$servicioId,
            $fechaHora->format('Y-m-d H:i:s')
        );

        if (!$reserva->guardar()) {
            responderJSON(['ok' => false, 'error' => 'No se pudo guardar la reserva. El barbero tiene ya esa hora reservada.'], 409);
        }

        // Si fallan las notificaciones, la reserva sigue siendo válida
        try {
            $barberoReservado  = Barbero::obtenerPorId($barberoId);
            $servicioReservado = Servicio::obtenerPorId($servicioId);
            if ($barberoReservado && $servicioReservado) {
                enviarNotificacionesReserva([
                    'cliente'    => $cliente->getNombreCompleto(),
                    'servicio'   => $servicioReservado->getNombre(),
                    'barbero'    => $barberoReservado->getNombre(),
                    'fecha_hora' => formatearFechaHoraNotificacion($reserva->getFechaHora()),
                    'email'      => $cliente->getEmail() ?? '',
                ]);
            }
        } catch (Throwable $e) {
            error_log('[reservas] Error en notificaciones: ' . $e->getMessage());
        }

        responderJSON(['ok' => true, 'mensaje' => 'Tu reserva se ha guardado correctamente. Gracias por reservar con nosotros.']);
    } catch (Throwable $e) {
        error_log('[reservas] ' . $e->getMessage());
        responderJSON(['ok' => false, 'error' => 'Ha ocurrido un error inesperado. Inténtalo de nuevo.'], 500);
    }
}

// ---------------------------------------------------------------
// GET: datos del formulario
// ---------------------------------------------------------------
ejecutarEndpoint(function () {
    $db = BD::obtenerConexion();

    // Qué servicios puede hacer cada barbero
    $barberoServicios = [];
    foreach ($db->query("SELECT barbero_id, servicio_id FROM barbero_servicio")->fetchAll(PDO::FETCH_ASSOC) as $rel) {
        $barberoServicios[$rel['barbero_id']][] = (int)$rel['servicio_id'];
    }

    // Categoría para los filtros del paso 1 (misma lógica que tenía la vista PHP)
    $categoriaFiltro = function (string $nombre): string {
        $n = mb_strtolower($nombre);
        $cat = 'otros';
        if (str_contains($n, 'corte') || str_contains($n, 'pelo') || str_contains($n, 'cejas')) { $cat = 'corte'; }
        if (str_contains($n, 'barba')) { $cat = str_contains($n, 'corte') ? 'otros' : 'barba'; }
        if (str_contains($n, 'tinte') || str_contains($n, 'color') || str_contains($n, 'mechas')) { $cat = 'tinte'; }
        return $cat;
    };

    return [
        'servicios' => array_map(function (Servicio $s) use ($categoriaFiltro) {
            return [
                'id'          => $s->getServicioId(),
                'nombre'      => $s->getNombre(),
                'descripcion' => $s->getDescripcion(),
                'precio'      => $s->getPrecio(),
                'duracion'    => $s->getDuracionMinutos(),
                'filtro'      => $categoriaFiltro($s->getNombre()),
            ];
        }, Servicio::obtenerTodos()),

        'barberos' => array_map(function (Barbero $b) use ($barberoServicios) {
            return [
                'id'           => $b->getBarberoId(),
                'nombre'       => $b->getNombre(),
                'especialidad' => $b->getEspecialidad() ?: 'Barbero Profesional',
                'foto_url'     => $b->getFotoUrl(),
                'servicios'    => $barberoServicios[$b->getBarberoId()] ?? [],
            ];
        }, Barbero::obtenerActivos()),

        // Formato original de la tabla: lo usa assets/script.js tal cual
        'horarios' => Horario::obtenerTodos(),

        // Reservas activas para que el navegador marque a los barberos ocupados
        'ocupadas' => $db->query("SELECT barbero_id, fecha_hora FROM reservas WHERE estado != 'cancelada'")->fetchAll(PDO::FETCH_ASSOC),
    ];
});
