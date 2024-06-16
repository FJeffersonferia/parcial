alert("Bienvenido Señor(a) usuario");
const verificarRol = () => {
    const rolAlmacenado = localStorage.getItem('rol');
    if (rolAlmacenado!== 'Usuario') {
        window.location.href = '../index.html';
    }
};

verificarRol();