document.addEventListener('DOMContentLoaded', function() {
  var nombre = localStorage.getItem('user');  // Cambiado para obtener el nombre del usuario
  if (nombre) {
    var mensaje = "Bienvenid@ " + nombre + "!";
    alert(mensaje);
  }
});
