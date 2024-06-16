document.addEventListener('DOMContentLoaded', function() {
    const tablaRecursos = document.getElementById('lista-recursos');

    fetch('https://raw.githubusercontent.com/FJeffersonferia/estudiantes/main/tabla-estudientes.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Datos cargados:', data);

            // Verificar la estructura de los datos recibidos
            if (Array.isArray(data)) {
                data.forEach(informe => {
                    const row = document.createElement('tr');

                    const cellFecha = document.createElement('td');
                    cellFecha.textContent = informe.Fecha;

                    const cellNombre = document.createElement('td');
                    cellNombre.textContent = informe.Nombre;

                    const cellMateria = document.createElement('td');
                    cellMateria.textContent = informe.Materia;

                    const cellCalificacion = document.createElement('td');
                    cellCalificacion.textContent = informe.Calificacion;

                    row.appendChild(cellFecha);
                    row.appendChild(cellNombre);
                    row.appendChild(cellMateria);
                    row.appendChild(cellCalificacion);

                    tablaRecursos.appendChild(row); // Append to the table body
                });
            } else {
                // Si los datos no son un arreglo, mostrar la estructura en la consola
                console.error('Datos recibidos no son un arreglo:', data);
            }
        })
        .catch(error => {
            console.error('Error al cargar los datos:', error);
        });
});
