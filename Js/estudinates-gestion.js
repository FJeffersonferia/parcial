document.addEventListener('DOMContentLoaded', function() {
    const tablaEstudiantes = document.getElementById('MOST');

    fetch('https://raw.githubusercontent.com/FJeffersonferia/reporte/main/estudiantesgestion.json')
       .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar el archivo JSON: ' +response.statusText);
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
                eliminarBtn.classList.add('eliminar-btn'); // Agregar clase para identificar el botón de eliminar
                eliminarBtn.addEventListener('click', function() {
                    row.style.display = 'none'; // Ocultar la fila al hacer clic en Eliminar
                });
                cellAccion.appendChild(eliminarBtn);

                row.appendChild(cellFecha);
                row.appendChild(cellNombre);
                row.appendChild(cellGrado);
                row.appendChild(cellCalificacion);
                row.appendChild(cellAccion);

                tablaEstudiantes.appendChild(row);
            });
        })
       .catch(error => {
            console.error('Error al cargar los datos:', error);
        });
});
