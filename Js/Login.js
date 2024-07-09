axios.defaults.baseURL = 'http://localhost:3000';

const login = () => {
    const usuario = document.getElementById('user').value;
    const contraseña = document.getElementById('pass').value;

    if (usuario.trim() === '' || contraseña.trim() === '') {
        alert('No puede haber campos vacíos.');
        return;
    }

    if (contraseña.length >= 6 && contraseña.length <= 15) {
        let hasNumber = false;
        let hasUpperCase = false;
        let hasLowerCase = false;
        let hasSpecialChar = false;
        let warnings = "";

        for (let i = 0; i < contraseña.length; i++) {
            let char = contraseña.charAt(i);
            if (char >= '0' && char <= '9') {
                hasNumber = true;
            } else if (char >= 'A' && char <= 'Z') {
                hasUpperCase = true;
            } else if (char >= 'a' && char <= 'z') {
                hasLowerCase = true;
            } else {
                hasSpecialChar = true;
            }
        }

        if (!hasNumber) {
            warnings += "La contraseña debe tener al menos un número (1, 2, 3...)\n";
        }
        if (!hasUpperCase) {
            warnings += "La contraseña debe tener al menos una mayúscula\n";
        }
        if (!hasLowerCase) {
            warnings += "La contraseña debe tener al menos una minúscula\n";
        }
        if (!hasSpecialChar) {
            warnings += "La contraseña debe tener al menos un caracter especial (&, _, $...)\n";
        }

        if (hasNumber && hasUpperCase && hasLowerCase && hasSpecialChar) {
            axios.post('/login', {
                Usuario: usuario,
                Contraseña: contraseña
            })
            .then(response => {
                if (response.data.success) {
                    alert('Inicio de sesión exitoso.');
                    switch (response.data.ID_Cargo) {
                        case 1:
                            window.location.href = "HTML/Reportes.html";
                            break;
                        case 2:
                            window.location.href = "HTML/Inicio.html";
                            break;
                        default:
                            alert('Usuario no tiene un rol válido');
                    }
                } else {
                    alert('Usuario/Contraseña incorrectos');
                }
            })
            .catch(error => {
                console.error('Hubo un error:', error);
                alert('Error al iniciar sesión');
            });
        } else {
            alert(warnings);
            alert("La contraseña no es segura.");
        }
    } else {
        alert("La contraseña debe tener entre 6 y 15 caracteres.");
    }
}

document.getElementById('registroForm').addEventListener('submit', function(event) {
    event.preventDefault();
    login();
});
