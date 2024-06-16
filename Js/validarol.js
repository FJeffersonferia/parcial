const validarRolEnPagina = (rolEsperado) => {
    const rolGuardado = localStorage.getItem('rol');
    console.log("Rol guardado:", rolGuardado); // Depuración
    console.log("Rol esperado:", rolEsperado); // Depuración
  
    if (rolGuardado !== rolEsperado) {
      window.location.href = "../Html/Login.html"; // Redirigir a la página de inicio de sesión si el rol no coincide
    }
  };
  
  document.addEventListener("DOMContentLoaded", () => {
    const pagina = window.location.pathname.split("/").pop();
    if (pagina === "admin.html") {
      validarRolEnPagina("Administrador");
    } else if (pagina === "usuario.html") {
      validarRolEnPagina("Usuario");
    } else if (pagina === "psicorientador.html") {
      validarRolEnPagina("Psicorientador");
    }
  });
  
  