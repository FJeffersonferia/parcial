document.addEventListener('DOMContentLoaded', function() {
    const tablaEstudiantes = document.getElementById('MOST');

    fetch('https://raw.githubusercontent.com/FJeffersonferia/estudiantes-bajo/main/estudinates.json')
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

                const cellMateria = document.createElement('td');
                cellMateria.textContent = estudiante.Materia;

                const cellCalificacion = document.createElement('td');
                cellCalificacion.textContent = estudiante.Calificacion;

                row.appendChild(cellFecha);
                row.appendChild(cellNombre);
                row.appendChild(cellMateria);
                row.appendChild(cellCalificacion);

                tablaEstudiantes.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error al cargar los datos:', error);
        });
});
