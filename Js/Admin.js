// admin.js
window.onload = function() {
    const rol = localStorage.getItem("rol");
    if (!rol || rol!== "Administrador") {
      // Redirigir a la página de login si no hay rol o no coincide con el rol de administrador
      window.location.href = "../Html/login.html";
    }
  };

verificarRol();
const apiUrl = 'https://raw.githubusercontent.com/Enderderek69/Json/main/credenciales';

fetch(apiUrl)
   .then(response => response.json())
   .then(data => {
        const usuario = data.find(usuario => usuario.rol === 'Administrador'); // Cambia 'admin' por el rol que deseas verificar
        if (usuario) {
            alert(`Bienvenido, ${usuario.nombre}!`);
        } else {
            alert('No tienes permiso para acceder');
        }
    })
   .catch(error => console.error('Error al obtener credenciales:', error));
   