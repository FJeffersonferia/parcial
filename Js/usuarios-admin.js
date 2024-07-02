document.addEventListener('DOMContentLoaded', function() {
    const tablaUsuarios = document.getElementById('MOST');

    fetch('https://raw.githubusercontent.com/Enderderek69/Json/main/credenciales')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error ' + response.status + ': ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log('Datos cargados:', data);

            if (Array.isArray(data.usuarios)) {
                data.usuarios.forEach(usuario => {
                    const row = document.createElement('tr');

                    const cellUsuario = document.createElement('td');
                    cellUsuario.textContent = usuario.user;

                    const cellPass = document.createElement('td');
                    cellPass.textContent = usuario.pass;

                    const cellRol = document.createElement('td');
                    cellRol.textContent = usuario.rol;

                    const cellEliminar = document.createElement('td');
                    const btnEliminar = document.createElement('button');
                    btnEliminar.textContent = 'Eliminar';
                    btnEliminar.classList.add('btn', 'btn-danger');
                    btnEliminar.addEventListener('click', () => {
                        row.remove();
                    });

                    cellEliminar.appendChild(btnEliminar);

                    row.appendChild(cellUsuario);
                    row.appendChild(cellPass);
                    row.appendChild(cellRol);
                    row.appendChild(cellEliminar);

                    tablaUsuarios.appendChild(row);
                });
            } else {
                console.error('El formato de los datos no es el esperado');
            }
        })
        .catch(error => {
            console.error('Error al cargar los datos:', error);
        });
});
