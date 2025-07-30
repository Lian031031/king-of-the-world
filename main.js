// Inicializa EmailJS con tu User ID real
emailjs.init("JoDSLYti5HhPdIQ-m");

// Prevenir envío automático de formularios
document.getElementById("formRegistro").addEventListener("submit", function(e) {
  e.preventDefault();
  validarRegistro();
});

document.getElementById("formLogin").addEventListener("submit", function(e) {
  e.preventDefault();
  validarLogin();
});

document.getElementById("formRecuperar").addEventListener("submit", function(e) {
  e.preventDefault();
  recuperarPassword();
});

// Mostrar formularios
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

function ocultarTodo() {
  ['registro', 'login', 'recuperar', 'mensaje'].forEach(id => {
    document.getElementById(id).style.display = 'none';
  });
}

// Guardar usuario en localStorage
function guardarUsuario(usuario) {
  let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  usuarios.push(usuario);
  localStorage.setItem("usuarios", JSON.stringify(usuarios));
}

// Validar registro
function validarRegistro() {
  const nombre = document.getElementById('nombre').value.trim();
  const correo = document.getElementById('correo').value.trim();
  const pass = document.getElementById('password').value;
  const confirmar = document.getElementById('confirmar').value;

  if (!nombre || !correo || !pass || !confirmar) {
    alert('⚠️ Completa todos los campos.');
    return;
  }

  if (pass !== confirmar) {
    alert('⚠️ Las contraseñas no coinciden.');
    return;
  }

  let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  const existe = usuarios.find(u => u.correo === correo);

  if (existe) {
    alert('⚠️ Este correo ya está registrado.');
    return;
  }

  const nuevoUsuario = { nombre, correo, pass };
  guardarUsuario(nuevoUsuario);
  localStorage.setItem("usuarioActivo", JSON.stringify(nuevoUsuario));

  alert('🎉 Registro exitoso. Bienvenido al Reino.');
  window.location.href = 'bienvenido.html';
}

// Validar login
function validarLogin() {
  const correo = document.getElementById('loginCorreo').value.trim();
  const pass = document.getElementById('loginPassword').value;

  if (!correo || !pass) {
    alert('⚠️ Ingresa tu correo y contraseña.');
    return;
  }

  let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  const usuario = usuarios.find(u => u.correo === correo && u.pass === pass);

  if (!usuario) {
    alert('❌ Credenciales incorrectas.');
    return;
  }

  localStorage.setItem("usuarioActivo", JSON.stringify(usuario));
  alert('✅ Inicio de sesión exitoso.\n🔥 Recuerda: El mundo no se conquista solo.');
  window.location.href = 'bienvenido.html';
}

window.onload = function () {
  const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));
  const correo = usuarioActivo?.correo;
  if (!correo) return;

  const claveLista = guardados_${correo};
  const lista = JSON.parse(localStorage.getItem(claveLista)) || [];
  const yaExiste = lista.some(item => item.url === "libro.html");

  if (!yaExiste) {
    document.getElementById("modalGuardar").style.display = "flex";
  }
};
// Guardar mentoría
function guardarLibro() {
  const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));
  if (!usuarioActivo?.correo) return alert("No se pudo identificar al usuario.");

  const correo = usuarioActivo.correo;
  const claveLista = guardados_${correo};
  const libroActual = { nombre: "King of the World", url: "libro.html" };

  let listaGuardados = JSON.parse(localStorage.getItem(claveLista)) || [];
  if (!listaGuardados.some(item => item.url === libroActual.url)) {
    listaGuardados.push(libroActual);
    localStorage.setItem(claveLista, JSON.stringify(listaGuardados));
    mostrarGuardadoExitoso();
  }

  document.getElementById("modalGuardar").style.display = "none";
}

// Mostrar mensaje visual
function mostrarGuardadoExitoso() {
  const mensaje = document.createElement("div");
  mensaje.innerText = "💾 Guardado con éxito. Tu mentoría ya forma parte de tu reino.";
  mensaje.className = "mensaje-exito";
  document.body.appendChild(mensaje);

  setTimeout(() => mensaje.remove(), 4000);
}

// Mostrar panel de guardados
function toggleGuardados() {
  const contenedor = document.getElementById("contenedorGuardados");
  contenedor.style.display = contenedor.style.display === "none" ? "block" : "none";
}

// Mostrar lista de guardados por correo
function mostrarGuardados() {
  const usuario = JSON.parse(localStorage.getItem("usuarioActivo"));
  if (!usuario?.correo) return;

  const claveLista = guardados_${usuario.correo};
  const guardados = JSON.parse(localStorage.getItem(claveLista)) || [];
  const lista = document.getElementById("listaGuardados");
  if (!lista) return;

  guardados.forEach(item => {
    const li = document.createElement("li");
    li.innerHTML = <a href="${item.url}">📌 ${item.nombre}</a>;
    lista.appendChild(li);
  });
}
mostrarGuardados();

// Recuperar contraseña
function recuperarPassword() {
  const correo = document.getElementById('recuperarCorreo').value.trim();
  let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  const usuario = usuarios.find(u => u.correo === correo);

  if (!correo) {
    alert('⚠️ Ingresa tu correo registrado.');
    return;
  }

  if (!usuario) {
    alert('❌ Correo no encontrado.');
    return;
  }

  const nuevaPassword = generarPassword();
  usuario.pass = nuevaPassword;

  const actualizados = usuarios.map(u => u.correo === correo ? usuario : u);
  localStorage.setItem("usuarios", JSON.stringify(actualizados));
  localStorage.setItem("usuarioActivo", JSON.stringify(usuario));

  emailjs.send("gmail_reydelmundo", "template_lider2025", {
    nombre: usuario.nombre,
    password: nuevaPassword,
    to_email: usuario.correo
  })
  .then(() => {
    alert("✅ Tu nueva contraseña ha sido enviada con poder y elegancia. ¡Recuerda quién eres!");
    mostrarAnimacionExito();
    volver();
  })
  .catch(error => {
    alert("❌ Error al enviar el correo. Intenta nuevamente.");
    console.error("EmailJS error:", error);
  });
}

// Generador de contraseña segura
function generarPassword() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789@#$%';
  let pass = '';
  for (let i = 0; i < 10; i++) {
    pass += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pass;
}

// Animación visual de éxito
function mostrarAnimacionExito() {
  const mensaje = document.createElement("div");
  mensaje.innerText = "🔐 Contraseña enviada con éxito. ¡Activa tu grandeza!";
  mensaje.style.position = "fixed";
  mensaje.style.top = "20px";
  mensaje.style.left = "50%";
  mensaje.style.transform = "translateX(-50%)";
  mensaje.style.background = "#111";
  mensaje.style.color = "#fff";
  mensaje.style.padding = "12px 24px";
  mensaje.style.borderRadius = "8px";
  mensaje.style.boxShadow = "0 0 10px rgba(0,0,0,0.3)";
  mensaje.style.zIndex = "9999";
  mensaje.style.fontWeight = "bold";
  document.body.appendChild(mensaje);

  setTimeout(() => {
    mensaje.remove();
  }, 4000);
}
