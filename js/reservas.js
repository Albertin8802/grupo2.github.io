const tablaReservas = document.getElementById('tablaReservas');
const sinReservas = document.getElementById('sinReservas');
const filtroDestino = document.getElementById('filtroDestino');
const filtroFecha = document.getElementById('filtroFecha');
const totalReservas = document.getElementById('totalReservas');
const totalPasajeros = document.getElementById('totalPasajeros');
const totalNoches = document.getElementById('totalNoches');
const totalGastado = document.getElementById('totalGastado');

function cargarReservas() {
    const reservas = JSON.parse(localStorage.getItem('reservasViajes')) || [];
    
    const destinoFiltro = filtroDestino.value;
    const fechaFiltro = filtroFecha.value;
    
    const reservasFiltradas = reservas.filter(reserva => {
        const coincideDestino = !destinoFiltro || reserva.destino === destinoFiltro;
        const coincideFecha = !fechaFiltro || reserva.fechaSalida === fechaFiltro;
        return coincideDestino && coincideFecha;
    });
    
    tablaReservas.innerHTML = '';
    
    if (reservasFiltradas.length === 0) {
        sinReservas.style.display = 'block';
    } else {
        sinReservas.style.display = 'none';
    }
    
    const formatter = new Intl.NumberFormat('es-PE', {
        style: 'currency',
        currency: 'PEN'
    });
    
    let totalPasajerosCount = 0;
    let totalNochesCount = 0;
    let totalGastadoAmount = 0;
    
    reservasFiltradas.forEach(reserva => {
        totalPasajerosCount += parseInt(reserva.pasajeros);
        totalNochesCount += parseInt(reserva.noches);
        totalGastadoAmount += parseFloat(reserva.precioTotal);
        
        const fila = document.createElement('tr');
        
        fila.innerHTML = `
            <td>${reserva.nombre}</td>
            <td>${reserva.dni}</td>
            <td>
                <div class="d-flex align-items-center">
                    <i class="fas fa-map-marker-alt text-primary me-2"></i>
                    ${reserva.destino}
                </div>
            </td>
            <td>${formatearFecha(reserva.fechaSalida)}</td>
            <td>
                <span class="badge bg-light text-dark">
                    <i class="fas fa-moon me-1"></i>${reserva.noches}
                </span>
            </td>
            <td>
                <span class="badge bg-light text-dark">
                    <i class="fas fa-users me-1"></i>${reserva.pasajeros}
                </span>
            </td>
            <td>
                <span class="fw-bold text-success">${formatter.format(reserva.precioTotal)}</span>
            </td>
            <td>
                <button class="btn btn-sm btn-outline-primary me-1" onclick="verDetalle('${reserva.id}')">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="eliminarReserva('${reserva.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        
        tablaReservas.appendChild(fila);
    });
    
    totalReservas.textContent = reservasFiltradas.length;
    totalPasajeros.textContent = totalPasajerosCount;
    totalNoches.textContent = totalNochesCount;
    totalGastado.textContent = formatter.format(totalGastadoAmount);
}

function formatearFecha(fecha) {
    const opciones = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(fecha).toLocaleDateString('es-PE', opciones);
}

function verDetalle(id) {
    const reservas = JSON.parse(localStorage.getItem('reservasViajes')) || [];
    const reserva = reservas.find(r => r.id == id);
    
    if (reserva) {
        alert(`Detalle de Reserva:\n\nNombre: ${reserva.nombre}\nDestino: ${reserva.destino}\nFecha: ${formatearFecha(reserva.fechaSalida)}\nNoches: ${reserva.noches}\nPasajeros: ${reserva.pasajeros}\nHabitación: ${reserva.habitacion}\nServicios: ${reserva.servicios.join(', ')}\nTotal: S/ ${reserva.precioTotal}`);
    }
}

function eliminarReserva(id) {
    if (confirm('¿Estás seguro de que quieres eliminar esta reserva?')) {
        let reservas = JSON.parse(localStorage.getItem('reservasViajes')) || [];
        reservas = reservas.filter(reserva => reserva.id != id);
        localStorage.setItem('reservasViajes', JSON.stringify(reservas));
        cargarReservas();
    }
}

filtroDestino.addEventListener('change', cargarReservas);
filtroFecha.addEventListener('change', cargarReservas);

document.addEventListener('DOMContentLoaded', cargarReservas);