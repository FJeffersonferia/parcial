document.addEventListener('DOMContentLoaded', function() {
    const formulario = document.getElementById('registro-form');
    const botonSubmit = formulario.querySelector('button[type="submit"]');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const rolSelect = document.getElementById('rol');
    const errorUsername = document.getElementById('error-username');
    const errorPassword = document.getElementById('error-password');
    const errorRol = document.getElementById('error-rol');

    formulario.addEventListener('submit', function(event) {
        event.preventDefault(); 
        
        errorUsername.textContent = '';
        errorPassword.textContent = '';
        errorRol.textContent = '';

        let valid = true;
        if (usernameInput.value.trim() === '') {
            errorUsername.textContent = 'Por favor ingresa un usuario.';
            valid = false;
        }
        if (passwordInput.value.trim() === '') {
            errorPassword.textContent = 'Por favor ingresa una contraseña.';
            valid = false;
        } else if (!validarPassword(passwordInput.value.trim())) {
            errorPassword.textContent = 'La contraseña debe contener al menos 8 caracteres, incluyendo al menos una letra mayúscula, una letra minúscula y un número.';
            valid = false;
        }

        if (rolSelect.value === '') {
            errorRol.textContent = 'Por favor selecciona un rol.';
            valid = false;
        }

        if (valid) {
            botonSubmit.disabled = true;

            const mensajeRegistro = document.createElement('div');
            mensajeRegistro.textContent = 'Usuario registrado';
            formulario.appendChild(mensajeRegistro);

            setTimeout(function() {
                mensajeRegistro.remove(); // Eliminar el mensaje después de un tiempo
                window.location.href = "../Html/usuarios-admin.html"; 
            }, 1000); 
        }
    });

    // Función para validar la contraseña
    function validarPassword(password) {
        // Al menos 8 caracteres, incluyendo al menos una letra mayúscula, una letra minúscula y un número
        const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
        return regex.test(password);
    }

    // Evento para limpiar el mensaje de error de contraseña cuando se escribe en el campo
    passwordInput.addEventListener('input', function() {
        if (validarPassword(passwordInput.value.trim())) {
            errorPassword.textContent = ''; // Limpiar el mensaje de error
        }
    });
});


  