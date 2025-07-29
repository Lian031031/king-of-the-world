// Mostrar secciones
function mostrarRegistro() {
  ocultarTodo();
  document.getElementById('registro').style.display = 'block';
}

function mostrarLogin() {
  ocultarTodo();
  document.getElementById('login').style.display = 'block';
}

function mostrarRecuperacion() {
  ocultarTodo();
  document.getElementById('recuperar').style.display = 'block';
}

function volver() {
  ocultarTodo();
  document.getElementById('mensaje').style.display = 'block';
}

// Ocultar todas las secciones
function ocultarTodo() {
  document.getElementById('registro').style.display = 'none';
  document.getElementById('login').style.display = 'none';
  document.getElementById('recuperar').style.display = 'none';
  document.getElementById('mensaje').style.display = 'none';
}

// Validar correo
function correoValido(correo) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
}

// Marcar error visual (sin alertas)
function marcarError(id) {
  document.getElementById(id).style.border = '2px solid #E53935';
}

// Limpiar errores visuales
function limpiarErrores() {
  const campos = document.querySelectorAll('input');
  campos.forEach(c => c.style.border = '1px solid #ccc');
}

// Obtener usuarios desde localStorage
function obtenerUsuarios() {
  const datos = localStorage.getItem("usuarios");
  return datos ? JSON.parse(datos) : [];
}

// Guardar nuevo usuario
function guardarUsuario(usuario) {
  const usuarios = obtenerUsuarios();
  usuarios.push(usuario);
  localStorage.setItem("usuarios", JSON.stringify(usuarios));
}

// Validar registro
function validarRegistro() {
  limpiarErrores();

  const nombre = document.getElementById('nombre').value.trim();
  const correo = document.getElementById('correo').value.trim();
  const password = document.getElementById('password').value;
  const confirmar = document.getElementById('confirmar').value;

  if (!correoValido(correo)) {
    marcarError('correo');
    return;
  }

  if (password !== confirmar) {
    marcarError('confirmar');
    return;
  }

  const usuarios = obtenerUsuarios();
  const existe = usuarios.find(u => u.correo === correo);
  if (existe) {
    marcarError('correo');
    return;
  }

  const nuevoUsuario = { nombre, correo, password };
  guardarUsuario(nuevoUsuario);

  localStorage.setItem("usuarioActivo", JSON.stringify(nuevoUsuario));
  window.location.href = "bienvenido.html";
}

// Validar login
function validarLogin() {
  limpiarErrores();

  const correo = document.getElementById('loginCorreo').value.trim();
  const password = document.getElementById('loginPassword').value;

  if (!correoValido(correo)) {
    marcarError('loginCorreo');
    return;
  }

  const usuarios = obtenerUsuarios();
  const usuario = usuarios.find(u => u.correo === correo && u.password === password);

  if (!usuario) {
    marcarError('loginCorreo');
    marcarError('loginPassword');
    return;
  }

  localStorage.setItem("usuarioActivo", JSON.stringify(usuario));
  window.location.href = "bienvenido.html";
}

// Recuperar contraseña
function recuperarPassword() {
  limpiarErrores();

  const correo = document.getElementById('recuperarCorreo').value.trim();
  const usuarios = obtenerUsuarios();
  const usuario = usuarios.find(u => u.correo === correo);

  if (!usuario) {
    marcarError('recuperarCorreo');
    return;
  }

  // Generar nueva contraseña simple
  const nuevaPassword = Math.random().toString(36).slice(-8);
  usuario.password = nuevaPassword;

  // Actualizar en localStorage
  const actualizados = usuarios.map(u => u.correo === correo ? usuario : u);
  localStorage.setItem("usuarios", JSON.stringify(actualizados));

  // Mostrar nueva contraseña en consola (sin alertas)
  console.log("Nueva contraseña:", nuevaPassword);

  volver();
}