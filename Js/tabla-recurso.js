document.addEventListener('DOMContentLoaded', function() {
    const tablaRecursos = document.getElementById('lista-recursos');
  
    fetch('https://raw.githubusercontent.com/FJeffersonferia/tabla-recurso/master/tabla-recurso.json')
     .then(response => response.json())
     .then(data => {
        console.log('Datos cargados:', data);
        data.recursos_apoyo.forEach(recurso => {
          const row = document.createElement('tr');
  
          const cellId = document.createElement('td');
          cellId.textContent = recurso.id;
  
          const cellNombre = document.createElement('td');
          cellNombre.textContent = recurso.nombre;
  
          const cellDescripcion = document.createElement('td');
          cellDescripcion.textContent = recurso.descripcion;
  
          const cellBeneficios = document.createElement('td');
          const beneficiosList = document.createElement('ul');
          recurso.beneficios.forEach(beneficio => {
            const beneficioItem = document.createElement('li');
            beneficioItem.textContent = beneficio;
            beneficiosList.appendChild(beneficioItem);
          });
          cellBeneficios.appendChild(beneficiosList);
  
          row.appendChild(cellId);
          row.appendChild(cellNombre);
          row.appendChild(cellDescripcion);
          row.appendChild(cellBeneficios);
  
          tablaRecursos.appendChild(row); // Append to the table body
        });
      })
     .catch(error => {
        console.error('Error al cargar los datos:');
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      });
  });
