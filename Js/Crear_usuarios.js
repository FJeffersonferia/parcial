axios.defaults.baseURL = 'http://localhost:3000';

function LOG() {
    var nombre = document.getElementById('nombre').value;
    var apellido = document.getElementById('apellido').value;
    var cedula = document.getElementById('cedula').value;
    var email = document.getElementById('email').value;
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    var rol = document.getElementById('rol').value;
    var telefono = document.getElementById('telefono').value;
    var edad = document.getElementById('edad').value;

    // Validación de campos
    if (!nombre || !apellido || !cedula || !email || !username || !password || !rol || !telefono || !edad) {
        alert("Por favor, completa todos los campos.");
        return;
    }

    // Objeto de datos a enviar
    var userData = {
        Nombre: nombre,
        Apellido: apellido,
        Cedula: cedula,
        Email: email,
        Usuario: username,
        Contraseña: password,
        Rol: rol,
        Telefono: telefono,
        Edad: edad
    };

    // Envío de la solicitud POST usando Axios
    axios.post('/add_contact', userData)
        .then(response => {
            console.log('Registro exitoso:', response.data);
            alert("Usuario registrado exitosamente.");
            // Redirige u realiza alguna acción adicional si es necesario
        })
        .catch(error => {
            console.error('Error al registrar usuario:', error);
            alert("Hubo un error al registrar el usuario. Por favor, inténtalo nuevamente.");
        });
}
