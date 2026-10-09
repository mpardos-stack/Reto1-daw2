/**
 * reservas.html — formulario de reserva en 5 pasos
 *
 * 1. Pide a /api/json/reservas.php (GET) servicios, barberos, horarios y reservas ocupadas
 * 2. Pinta las tarjetas con la misma estructura HTML que esperaba assets/script.js
 * 3. Expone window.reservaScheduleData y window.reservasOcupadas (antes los imprimía PHP)
 * 4. Al confirmar, envía el formulario por fetch (POST) y muestra la respuesta JSON
 */
(function () {
    const alerta = document.getElementById('reserva-alerta');
    const form = document.getElementById('form-reserva');

    function mostrarAlerta(tipo, mensaje) {
        const exito = tipo === 'success';
        const caja = App.crear('div', 'alert alert-' + tipo);
        caja.appendChild(App.crear('span', 'alert-icono', exito ? '✓' : '⚠'));
        const texto = App.crear('div', 'alert-texto');
        texto.appendChild(App.crear('strong', '', exito ? '¡Reserva confirmada!' : 'No se pudo completar la reserva'));
        texto.appendChild(App.crear('p', '', mensaje));
        caja.appendChild(texto);
        alerta.replaceChildren(caja);
        alerta.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    function tarjetaServicio(s) {
        const label = App.crear('label', 'card-option servicio-card');
        label.dataset.cat = s.filtro;
        label.dataset.duracion = s.duracion;

        const input = document.createElement('input');
        input.type = 'radio';
        input.name = 'servicio_id';
        input.value = s.id;
        input.required = true;

        const contenido = App.crear('div', 'card-content');
        const info = App.crear('div', 'card-info');
        info.append(App.crear('h3', '', s.nombre), App.crear('p', '', s.descripcion || ''));
        const meta = App.crear('div', 'card-meta');
        meta.append(
            App.crear('span', 'precio', Number(s.precio).toFixed(2) + ' €'),
            App.crear('span', 'duracion', s.duracion + ' min')
        );
        contenido.append(info, meta);
        label.append(input, contenido);
        return label;
    }

    function tarjetaBarbero(b) {
        const label = App.crear('label', 'card-option barbero-card');
        label.dataset.id = b.id;
        label.dataset.servicios = b.servicios.join(',');

        const input = document.createElement('input');
        input.type = 'radio';
        input.name = 'barbero_id';
        input.value = b.id;
        input.required = true;

        const contenido = App.crear('div', 'card-content-barbero');
        const imgBox = App.crear('div', 'barbero-img');
        const img = document.createElement('img');
        img.src = b.foto_url || '../../assets/img/default-avatar.png';
        img.alt = b.nombre;
        img.onerror = () => { img.onerror = null; img.src = '../../assets/img/default-avatar.png'; };
        imgBox.appendChild(img);
        contenido.append(imgBox, App.crear('h3', '', b.nombre), App.crear('span', 'especialidad', b.especialidad));
        label.append(input, contenido);
        return label;
    }

    // --- Carga de datos (script.js se carga cuando esto termina) ---
    App.esperar((async () => {
        try {
            const datos = await App.json('reservas.php');

            window.reservaScheduleData = datos.horarios;
            window.reservasOcupadas = datos.ocupadas;

            const gridServicios = document.querySelector('.servicios-grid');
            datos.servicios.forEach(s => gridServicios.appendChild(tarjetaServicio(s)));

            const gridBarberos = document.querySelector('.barberos-grid');
            datos.barberos.forEach(b => gridBarberos.appendChild(tarjetaBarbero(b)));
        } catch (error) {
            console.error('Error al cargar el formulario de reservas:', error);
            mostrarAlerta('error', 'No se pudieron cargar los servicios y barberos. Recarga la página o inténtalo más tarde.');
        }

        // Mensaje tras una reserva correcta (equivale al antiguo ?reserva=ok)
        if (new URLSearchParams(location.search).get('reserva') === 'ok') {
            mostrarAlerta('success', 'Tu reserva se ha guardado correctamente. Gracias por reservar con nosotros.');
        }
    })());

    // --- Envío del formulario por JSON ---
    // Se registra después de script.js para respetar su comprobación de la política de privacidad
    App.scriptListo.then(() => {
        form.addEventListener('submit', async (e) => {
            if (e.defaultPrevented) return;   // script.js lo ha bloqueado (política sin aceptar)
            e.preventDefault();

            const boton = document.getElementById('btn-confirmar-reserva');
            boton.disabled = true;

            try {
                const respuesta = await App.json('reservas.php', { method: 'POST', body: new FormData(form) });

                if (respuesta && respuesta.ok) {
                    // Recargamos limpio, igual que hacía el header('Location: ...') de PHP
                    location.href = 'reservas.html?reserva=ok';
                    return;
                }
                mostrarAlerta('error', (respuesta && respuesta.error) || 'No se pudo guardar la reserva.');
            } catch (error) {
                console.error('Error al enviar la reserva:', error);
                mostrarAlerta('error', 'No se pudo conectar con el servidor. Inténtalo de nuevo.');
            }
            boton.disabled = false;
        });
    });
})();
