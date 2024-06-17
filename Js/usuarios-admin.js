document.addEventListener('DOMContentLoaded', function() {
  const tablaUsuarios = document.getElementById('tabla-usuarios');

  fetch('https://raw.githubusercontent.com/Enderderek69/Json/main/credenciales')
      .then(response => {
          if (!response.ok) {
              throw new Error('Error ' + response.status + ': ' + response.statusText);
          }
          return response.json();
      })
      .then(data => {
          console.log('Datos cargados:', data);

          data.usuarios.forEach(usuario => {
              const row = document.createElement('tr');

              const cellUsuario = document.createElement('td');
              cellUsuario.textContent = usuario.user;

              const cellPass = document.createElement('td');
              cellPass.textContent = usuario.pass;

              const cellRol = document.createElement('td');
              cellRol.textContent = usuario.rol;

              const cellEliminar = document.createElement('td'); // Celda para el botón de "Eliminar"

              const btnEliminar = document.createElement('button');
              btnEliminar.textContent = 'Eliminar';
              btnEliminar.classList.add('btn-eliminar'); // Agregar la clase CSS 'btn-eliminar' al botón
              btnEliminar.addEventListener('click', () => {
                  // Ocultar la fila al hacer clic en el botón eliminar
                  row.style.display = 'none';
              });

              cellEliminar.appendChild(btnEliminar);
              
              row.appendChild(cellUsuario);
              row.appendChild(cellPass);
              row.appendChild(cellRol);
              row.appendChild(cellEliminar); // Agregar la celda del botón eliminar a la fila

              tablaUsuarios.tBodies[0].appendChild(row);
          });
      })
      .catch(error => {
          console.error('Error al cargar los datos:', error);
      });
});

function redireccionar() {
  // Cambiar la ubicación actual del navegador
  window.location.href = "../Html/Crear_usuarios.html";
}
