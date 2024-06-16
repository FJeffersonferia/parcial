document.addEventListener("DOMContentLoaded", function () {
    const toggleButton = document.getElementById('toggleSidebar');
    toggleButton.addEventListener('click', function (event) {
        event.preventDefault();
        document.body.classList.toggle('active');
    });
});
window.onload = () => {
    const rolAlmacenado = localStorage.getItem("rol");
    if (rolAlmacenado!== "Psicorientador") {
      window.location.href = "../index.html"; // Redirigir a la página de inicio de sesión
    }
  };
