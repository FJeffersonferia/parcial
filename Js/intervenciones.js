document.addEventListener('DOMContentLoaded', function() {
    const tablaIntervenciones = document.getElementById('tabla-seguimiento');
    const url = 'https://raw.githubusercontent.com/FJeffersonferia/intervenciones2/main/intervenciones.json';

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar el archivo JSON: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log('Datos cargados:', data);
            if (data && Array.isArray(data.intervenciones)) {
                data.intervenciones.forEach(intervencion => {
                    const row = document.createElement('tr');

                    const cellFecha = document.createElement('td');
                    cellFecha.textContent = intervencion.fecha;

                    const cellEstudiante = document.createElement('td');
                    cellEstudiante.textContent = intervencion.estudiante;

                    const cellTipo = document.createElement('td');
                    cellTipo.textContent = intervencion.tipo;

                    const cellDetalles = document.createElement('td');
                    cellDetalles.textContent = intervencion.detalles;

                    const cellResultado = document.createElement('td');
                    cellResultado.textContent = intervencion.resultado;

                    row.appendChild(cellFecha);
                    row.appendChild(cellEstudiante);
                    row.appendChild(cellTipo);
                    row.appendChild(cellDetalles);
                    row.appendChild(cellResultado);

                    tablaIntervenciones.querySelector('tbody').appendChild(row);
                });
            } else {
                console.error('No se encontraron datos válidos de intervenciones.');
            }
        })
        .catch(error => {
            console.error('Error al cargar los datos:', error);
        });
});
