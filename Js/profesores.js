document.addEventListener('DOMContentLoaded', function() {
    const tablaRecursos = document.getElementById('lista-recursos');
  
    fetch('https://raw.githubusercontent.com/Enderderek69/Json/main/Profesores')
     .then(response => response.json())
     .then(data => {
        console.log('Datos cargados:', data);
        data.profesores.forEach(profesor => { // Cambiado a 'profesores'
          const row = document.createElement('tr');
  
          const cellId = document.createElement('td');
          cellId.textContent = profesor.id;
  
          const cellNombre = document.createElement('td');
          cellNombre.textContent = profesor.nombre;
  
          const cellAsignatura = document.createElement('td');
          cellAsignatura.textContent = profesor.asignatura;
  
          const cellEmail = document.createElement('td');
          cellEmail.textContent = profesor.email;
  
          row.appendChild(cellId);
          row.appendChild(cellNombre);
          row.appendChild(cellAsignatura);
          row.appendChild(cellEmail);
  
          tablaRecursos.appendChild(row); // Append to the table body
        });
      })
     .catch(error => {
        console.error('Error al cargar los datos:', error);
      });
});
