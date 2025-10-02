function reservarDestino(destino, precio) {
    localStorage.setItem('destinoSeleccionado', destino);
    localStorage.setItem('precioBase', precio);
    
    window.location.href = 'reserva.html';
}

document.addEventListener('DOMContentLoaded', function() {
    const filtroExperiencia = document.getElementById('filtroExperiencia');
    const filtroOrden = document.getElementById('filtroOrden');
    const gridDestinos = document.getElementById('gridDestinos');
    const destinos = Array.from(gridDestinos.children);

    function aplicarFiltros() {
        const experiencia = filtroExperiencia.value;
        const orden = filtroOrden.value;
        
        let destinosFiltrados = destinos;
        
        if (experiencia) {
            destinosFiltrados = destinos.filter(destino => {
                return destino.getAttribute('data-experiencia').includes(experiencia);
            });
        }
        
        destinosFiltrados.sort((a, b) => {
            const precioA = parseInt(a.querySelector('.destino-precio').textContent.replace('S/ ', ''));
            const precioB = parseInt(b.querySelector('.destino-precio').textContent.replace('S/ ', ''));
            const nombreA = a.querySelector('h3').textContent;
            const nombreB = b.querySelector('h3').textContent;
            const nochesA = parseInt(a.querySelector('.info-item:nth-child(2) span').textContent);
            const nochesB = parseInt(b.querySelector('.info-item:nth-child(2) span').textContent);
            
            switch(orden) {
                case 'precio':
                    return precioA - precioB;
                case 'precio-desc':
                    return precioB - precioA;
                case 'nombre':
                    return nombreA.localeCompare(nombreB);
                case 'noches':
                    return nochesB - nochesA;
                default:
                    return 0;
            }
        });
        
        gridDestinos.innerHTML = '';
        
        destinosFiltrados.forEach(destino => {
            gridDestinos.appendChild(destino);
        });
    }

    filtroExperiencia.addEventListener('change', aplicarFiltros);
    filtroOrden.addEventListener('change', aplicarFiltros);
});

function cargarDestinoSeleccionado() {
    const destinoSeleccionado = localStorage.getItem('destinoSeleccionado');
    const precioBase = localStorage.getItem('precioBase');
    
    if (destinoSeleccionado && window.location.pathname.includes('reserva.html')) {
        const selectDestino = document.getElementById('destino');
        if (selectDestino) {
            selectDestino.value = destinoSeleccionado;
            
            const event = new Event('change');
            selectDestino.dispatchEvent(event);
        }
    }
}

if (window.location.pathname.includes('reserva.html')) {
    document.addEventListener('DOMContentLoaded', cargarDestinoSeleccionado);
}