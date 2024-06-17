const cargarCredenciales = () => {
  const url = "https://raw.githubusercontent.com/Enderderek69/Json/main/credenciales";

  return fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error("Error al cargar el archivo JSON");
      }
      return response.json();
    })
    .then(data => data.usuarios)
    .catch(error => {
      console.error("Error al cargar las credenciales:", error);
      throw error;
    });
};

const mostrarErrorEnPagina = (mensaje) => {
  const mensajeDiv = document.getElementById("mensaje");
  mensajeDiv.innerText = mensaje;
  mensajeDiv.style.display = "block";
  setTimeout(() => {
    mensajeDiv.style.display = "none";
  }, 3000);
};

const ocultarErrorEnPagina = () => {
  const mensajeDiv = document.getElementById("mensaje");
  mensajeDiv.style.display = "none";
};

const validarUsuario = () => {
  const usuarioInput = document.getElementById("user");
  const usuarioValue = usuarioInput.value.trim();
  if (usuarioValue === "") {
    mostrarErrorEnPagina("Ingrese un usuario válido");
    return false;
  }
  ocultarErrorEnPagina();
  return true;
};

const validarContraseña = () => {
  const contraseñaInput = document.getElementById("pass");
  const contraseñaValue = contraseñaInput.value.trim();
  if (contraseñaValue === "") {
    mostrarErrorEnPagina("Ingrese una contraseña válida");
    return false;
  }
  ocultarErrorEnPagina();
  return true;
};

const validarRol = () => {
  const rol = document.querySelector('input[name="rol"]:checked');
  if (!rol) {
    mostrarErrorEnPagina("Seleccione un rol");
    return false;
  }
  ocultarErrorEnPagina();
  return true;
};

const mostrarMensaje = async (event) => {
  event.preventDefault();
  if (!validarUsuario() || !validarContraseña() || !validarRol()) {
    return;
  }
  const usuarioValue = document.getElementById("user").value.trim();
  const contraseñaValue = document.getElementById("pass").value.trim();
  const rolValue = document.querySelector('input[name="rol"]:checked').value;
  try {
    const usuarios = await cargarCredenciales();
    const usuarioValido = usuarios.find(
      (u) => u.user === usuarioValue &&
             u.pass === contraseñaValue &&
             u.rol === rolValue
    );

    if (usuarioValido) {
      localStorage.setItem('sessionToken', btoa(`${usuarioValue}:${rolValue}`));
      if (rolValue === "Administrador") {
        window.location.href = "../Html/admin.html";
      } else if (rolValue === "Usuario") {
        window.location.href = "../Html/usuario.html";
      } else if (rolValue === "Psicorientador") {
        window.location.href = "../Html/psicorientador.html";
      }
    } else {
      mostrarErrorEnPagina("Credenciales incorrectas. Verifique los datos e intente nuevamente.");
    }
  } catch (error) {
    mostrarErrorEnPagina("Error al cargar las credenciales. Inténtelo más tarde.");
  }
};

document.getElementById("user").addEventListener("input", validarUsuario);
document.getElementById("pass").addEventListener("input", validarContraseña);
document.getElementById("registroForm").addEventListener("submit", mostrarMensaje);
