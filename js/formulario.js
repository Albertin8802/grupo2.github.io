const preciosBase = {
    "Machu Picchu - Cuzco": 800,
    "Lago Titicaca - Puno": 600,
    "Chan Chan - Trujillo": 450,
    "Kuelap - Amazonas": 500,
    "Líneas de Nazca - Ica": 400
};

const formReserva = document.getElementById('formReserva');
const resumenReserva = document.getElementById('resumenReserva');
const totalPagar = document.getElementById('totalPagar');
const fechaSalidaInput = document.getElementById('fechaSalida');

const hoy = new Date();
const fechaMinima = new Date(hoy);
fechaMinima.setDate(hoy.getDate() + 7);
fechaSalidaInput.min = fechaMinima.toISOString().split('T')[0];

function calcularPrecio() {
    const destino = document.getElementById('destino').value;
    const noches = parseInt(document.getElementById('noches').value) || 0;
    const pasajeros = parseInt(document.getElementById('pasajeros').value) || 0;
    
    let precioTotal = 0;
    
    if (destino && noches > 0 && pasajeros > 0) {
        precioTotal = preciosBase[destino] * noches * pasajeros;
        
        const servicios = document.querySelectorAll('input[type="checkbox"]:checked');
        servicios.forEach(servicio => {
            precioTotal += parseInt(servicio.value) * pasajeros;
        });
    }
    
    return precioTotal;
}

function actualizarResumen() {
    const destino = document.getElementById('destino').value;
    const noches = document.getElementById('noches').value;
    const pasajeros = document.getElementById('pasajeros').value;
    const habitacion = document.querySelector('input[name="habitacion"]:checked');
    const precioTotal = calcularPrecio();
    
    const formatter = new Intl.NumberFormat('es-PE', {
        style: 'currency',
        currency: 'PEN'
    });
    
    if (destino && noches && pasajeros && destino !== "") {
        let serviciosText = "";
        const servicios = document.querySelectorAll('input[type="checkbox"]:checked');
        if (servicios.length > 0) {
            serviciosText = "<div class='resumen-item'><span class='label'>Servicios:</span><span class='value'>";
            servicios.forEach((servicio, index) => {
                serviciosText += servicio.parentElement.querySelector('span').textContent;
                if (index < servicios.length - 1) serviciosText += ", ";
            });
            serviciosText += "</span></div>";
        }
        
        let habitacionText = "";
        if (habitacion) {
            habitacionText = `<div class="resumen-item"><span class="label">Habitación:</span><span class="value">${habitacion.parentElement.querySelector('span').textContent}</span></div>`;
        }
        
        resumenReserva.innerHTML = `
            <div class="resumen-item">
                <span class="label">Destino:</span>
                <span class="value">${destino}</span>
            </div>
            <div class="resumen-item">
                <span class="label">Noches:</span>
                <span class="value">${noches}</span>
            </div>
            <div class="resumen-item">
                <span class="label">Pasajeros:</span>
                <span class="value">${pasajeros}</span>
            </div>
            ${habitacionText}
            ${serviciosText}

        `;
        
        totalPagar.textContent = formatter.format(precioTotal);
    } else {
        resumenReserva.innerHTML = `
            <div class="resumen-placeholder">
                <i class="fas fa-info-circle"></i>
                <p>Complete el formulario para ver el resumen de su reserva</p>
            </div>
        `;
        totalPagar.textContent = "S/ 0.00";
    }
}

document.getElementById('destino').addEventListener('change', actualizarResumen);
document.getElementById('noches').addEventListener('input', actualizarResumen);
document.getElementById('pasajeros').addEventListener('input', actualizarResumen);
document.getElementById('fechaSalida').addEventListener('change', actualizarResumen);

document.querySelectorAll('input[name="habitacion"]').forEach(radio => {
    radio.addEventListener('change', actualizarResumen);
});

document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', actualizarResumen);
});

formReserva.addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (!formReserva.checkValidity()) {
        e.stopPropagation();
        formReserva.classList.add('was-validated');
        return;
    }
    
    const destino = document.getElementById('destino').value;
    const noches = document.getElementById('noches').value;
    const pasajeros = document.getElementById('pasajeros').value;
    const fechaSalida = document.getElementById('fechaSalida').value;
    const habitacion = document.querySelector('input[name="habitacion"]:checked').value;
    const servicios = Array.from(document.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.parentElement.querySelector('span').textContent);
    const precioTotal = calcularPrecio();
    
    const reserva = {
        nombre: document.getElementById('nombre').value,
        dni: document.getElementById('dni').value,
        email: document.getElementById('email').value,
        destino: destino,
        fechaSalida: fechaSalida,
        noches: noches,
        pasajeros: pasajeros,
        habitacion: habitacion,
        servicios: servicios,
        precioTotal: precioTotal,
        id: Date.now()
    };
    
    let reservas = JSON.parse(localStorage.getItem('reservasViajes')) || [];
    reservas.push(reserva);
    localStorage.setItem('reservasViajes', JSON.stringify(reservas));
    
    alert('¡Reserva confirmada correctamente! Te hemos enviado un email de confirmación.');
    
    window.location.href = 'reservas.html';
});

document.addEventListener('DOMContentLoaded', function() {
    actualizarResumen();
});