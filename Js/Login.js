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

// Función para mostrar errores en la página con temporizador
const mostrarErrorEnPagina = (mensaje) => {
  const mensajeDiv = document.getElementById("mensaje");
  mensajeDiv.innerText = mensaje;
  mensajeDiv.style.display = "block";

  // Ocultar el mensaje después de 3 segundos
  setTimeout(() => {
    mensajeDiv.style.display = "none";
  }, 3000);
};

// Función para ocultar el mensaje de error en la página
const ocultarErrorEnPagina = () => {
  const mensajeDiv = document.getElementById("mensaje");
  mensajeDiv.style.display = "none";
};

// Validación en tiempo real para el campo de usuario
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

// Validación en tiempo real para el campo de contraseña
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

// Función para validar el campo de rol
const validarRol = () => {
  const rol = document.querySelector('input[name="rol"]:checked');

  if (!rol) {
    mostrarErrorEnPagina("Seleccione un rol");
    return false;
  }

  ocultarErrorEnPagina();
  return true;
};

// Función para manejar el envío del formulario
const mostrarMensaje = async (event) => {
  event.preventDefault();

  // Validar usuario, contraseña y rol antes de intentar cargar las credenciales
  if (!validarUsuario() || !validarContraseña() || !validarRol()) {
    return;
  }

  const usuarioValue = document.getElementById("user").value.trim();
  const contraseñaValue = document.getElementById("pass").value.trim();
  const rolValue = document.querySelector('input[name="rol"]:checked').value;

  try {
    // Cargar las credenciales desde el archivo JSON
    const usuarios = await cargarCredenciales();

    // Verificar si las credenciales del usuario existen en el archivo JSON
    const usuarioValido = usuarios.find(
      (u) => u.user === usuarioValue &&
             u.pass === contraseñaValue &&
             u.rol === rolValue
    );

    if (usuarioValido) {
      // Limpiar cualquier sesión previa
      localStorage.clear();
      // Guardar las credenciales en localStorage
      localStorage.setItem('sessionToken', btoa(JSON.stringify({ user: usuarioValue, rol: rolValue })));

      // Redirigir a la página correspondiente según el rol
      if (rolValue === "Administrador") {
        window.location.href = "../Html/admin.html";
      } else if (rolValue === "Usuario") {
        window.location.href = "../Html/usuario.html";
      } else if (rolValue === "Psicorientador") {
        window.location.href = "../Html/psicorientador.html";
      }
    } else {
      // Mostrar un mensaje genérico de credenciales incorrectas
      mostrarErrorEnPagina("Credenciales incorrectas. Verifique los datos e intente nuevamente.");
    }
  } catch (error) {
    // Mostrar un mensaje de error al cargar las credenciales
    mostrarErrorEnPagina("Error al cargar las credenciales. Inténtelo más tarde.");
  }
};

// Agregar eventos para la validación en tiempo real
document.getElementById("user").addEventListener("input", validarUsuario);
document.getElementById("pass").addEventListener("input", validarContraseña);

// Agregar evento al formulario
document.getElementById("registroForm").addEventListener("submit", mostrarMensaje);
