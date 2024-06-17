window.onload = function() {
  const sessionToken = localStorage.getItem('sessionToken');
  if (!sessionToken) {
      window.location.href = '../Html/Login.html';
      return;
  }

  const { user, rol } = JSON.parse(atob(sessionToken));
  if (rol !== 'Administrador') {
      window.location.href = '../Html/Login.html';
  } else {
      alert(`Bienvenido, ${user}!`);
  }
};

const apiUrl = 'https://raw.githubusercontent.com/Enderderek69/Json/main/credenciales';

fetch(apiUrl)
 .then(response => response.json())
 .then(data => {
      const usuario = data.find(usuario => usuario.rol === 'Administrador');
      if (usuario) {
          console.log(`Usuario encontrado: ${usuario.nombre}`);
      } else {
          alert('No tienes permiso para acceder');
      }
  })
 .catch(error => console.error('Error al obtener credenciales:', error));
