document.addEventListener('DOMContentLoaded', function() {
    const tablaEstudiantes = document.getElementById('tabla-seguimiento');

    fetch('https://raw.githubusercontent.com/FJeffersonferia/reporte/main/estudiantesgestion.json')
       .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar el archivo JSON: ' + response.statusText);
            }
            return response.json();
        })
       .then(data => {
            console.log('Datos cargados:', data);
            data.forEach(estudiante => {
                const row = document.createElement('tr');

                const cellFecha = document.createElement('td');
                cellFecha.textContent = estudiante.Fecha;

                const cellNombre = document.createElement('td');
                cellNombre.textContent = estudiante.Nombre;

                const cellGrado = document.createElement('td');
                cellGrado.textContent = estudiante.Grado;

                const cellCalificacion = document.createElement('td');
                cellCalificacion.textContent = estudiante.Calificacion;

                const cellAccion = document.createElement('td');
                const eliminarBtn = document.createElement('button');
                eliminarBtn.textContent = 'Eliminar';
                eliminarBtn.classList.add('btn', 'btn-danger', 'eliminar-btn'); // Agregar clases para estilizar el botón
                eliminarBtn.addEventListener('click', function() {
                    row.remove(); // Eliminar la fila al hacer clic en Eliminar
                });
                cellAccion.appendChild(eliminarBtn);

                row.appendChild(cellFecha);
                row.appendChild(cellNombre);
                row.appendChild(cellGrado);
                row.appendChild(cellCalificacion);
                row.appendChild(cellAccion);

                tablaEstudiantes.querySelector('tbody').appendChild(row);
            });
        })
       .catch(error => {
            console.error('Error al cargar los datos:', error);
        });
});
