document.addEventListener("DOMContentLoaded", function () {
  const toggleButton = document.getElementById('toggleSidebar');
  toggleButton.addEventListener('click', function (event) {
      event.preventDefault();
      document.body.classList.toggle('active');
  });

  // Verificar rol almacenado en localStorage
  const rolAlmacenado = localStorage.getItem("rol");
  if (rolAlmacenado !== "Psicorientador") {
      window.location.href = "../index.html"; // Redirigir a la página de inicio de sesión si no es Psicorientador
  } else {
      // Código adicional aquí si es necesario
      alert("Bienvenido, Psicorientador!"); // Ejemplo de mensaje de bienvenida
  }
});

