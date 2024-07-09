axios.defaults.baseURL = 'http://localhost:3000';

document.addEventListener('DOMContentLoaded', function() {
  const userTableBody = document.querySelector('#MOST');
  let users = [];

  const cargarUsuarios = () => {
    axios.get('/getAll')
      .then(response => {
        users = response.data;
        renderUserTable();
      })
      .catch(error => console.log('Hubo un error: ' + error.message));
  };

  function renderUserTable() {
    userTableBody.innerHTML = '';
    users.forEach((user, index) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${user.ID}</td>
        <td>${user.Cedula}</td>
        <td>${user.Nombre}</td>
        <td>${user.Apellido}</td>
        <td>${user.Email}</td>
        <td>${user.Usuario}</td>
        <td>${user.Contraseña}</td> 
        <td>${user.Telefono}</td>
        <td>${user.Edad}</td>
        <td>
          <select data-index="${index}" class="form-select">
            <option value="1" ${user.Rol === 1 ? 'selected' : ''}>Administrador</option>
            <option value="2" ${user.Rol === 2 ? 'selected' : ''}>Usuario</option>
            <option value="3" ${user.Rol === 3 ? 'selected' : ''}>Psicorientador</option>
          </select>
        </td>
        <td><button class="btn btn-danger"data-index="${index}">Eliminar</button></td>
      `;
      userTableBody.appendChild(tr);
    });
  }

  userTableBody.addEventListener('change', function(event) {
    if (event.target.tagName === 'SELECT') {
      const index = event.target.getAttribute('data-index');
      const nuevoRol = event.target.value;
      const userId = users[index].ID;
      axios.put(`/update/${userId}`, { Rol: nuevoRol })
        .then(response => {
          users[index].Rol = parseInt(nuevoRol);
          alert('El rol fue actualizado');
        })
        .catch(error => console.log('Hubo un error: ' + error.message));
    }
  });

  userTableBody.addEventListener('click', function(event) {
    if (event.target.tagName === 'BUTTON') {
      const index = event.target.getAttribute('data-index');
      const userId = users[index].ID;
      axios.delete(`/delete/${userId}`)
        .then(response => {
          users.splice(index, 1);
          renderUserTable();
          alert('Usuario eliminado');
        })
        .catch(error => console.log('Hubo un error: ' + error.message));
    }
  });

  cargarUsuarios();
});