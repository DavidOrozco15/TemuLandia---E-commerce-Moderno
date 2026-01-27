// ===== SISTEMA DE AUTENTICACIÓN =====
// Gestiona registro, login y sesión de usuarios

// Obtener usuarios registrados del localStorage
function obtenerUsuarios() {
    return JSON.parse(localStorage.getItem("usuarios")) || [];
}

// Guardar usuarios en localStorage
function guardarUsuarios(usuarios) {
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
}

// Obtener usuario actual logueado
function obtenerUsuarioActual() {
    return JSON.parse(localStorage.getItem("usuario-actual")) || null;
}

// Establecer usuario actual logueado
function establecerUsuarioActual(usuario) {
    localStorage.setItem("usuario-actual", JSON.stringify(usuario));
}

// Cerrar sesión
function cerrarSesion() {
    localStorage.removeItem("usuario-actual");
    // Limpiar carrito del usuario anterior
    localStorage.removeItem("productos-en-carrito");
    window.location.href = "./inicio.html";
}

// Registrar nuevo usuario
function registrarUsuario(email, contraseña) {
    const usuarios = obtenerUsuarios();
    
    // Verificar si el email ya existe
    if (usuarios.some(u => u.email === email)) {
        return { exito: false, mensaje: "Este email ya está registrado" };
    }
    
    // Verificar que contraseña no esté vacía
    if (!contraseña || contraseña.length < 4) {
        return { exito: false, mensaje: "La contraseña debe tener al menos 4 caracteres" };
    }
    
    // Crear nuevo usuario
    const nuevoUsuario = {
        id: Date.now(),
        email: email,
        contraseña: contraseña, // Sin hash (proyecto educativo)
        fechaRegistro: new Date().toLocaleString('es-ES')
    };
    
    usuarios.push(nuevoUsuario);
    guardarUsuarios(usuarios);
    
    return { exito: true, mensaje: "Registro exitoso. Ahora puedes iniciar sesión." };
}

// Login de usuario
function loginUsuario(email, contraseña) {
    const usuarios = obtenerUsuarios();
    
    const usuario = usuarios.find(u => u.email === email && u.contraseña === contraseña);
    
    if (!usuario) {
        return { exito: false, mensaje: "Email o contraseña incorrectos" };
    }
    
    // Establecer usuario actual
    establecerUsuarioActual({
        id: usuario.id,
        email: usuario.email,
        fechaRegistro: usuario.fechaRegistro
    });
    
    return { exito: true, mensaje: "Sesión iniciada correctamente" };
}

// Obtener historial de compras del usuario actual
function obtenerHistorialUsuario() {
    const usuarioActual = obtenerUsuarioActual();
    if (!usuarioActual) return [];
    
    const todosHistoriales = JSON.parse(localStorage.getItem("historial-compras")) || {};
    return todosHistoriales[usuarioActual.id] || [];
}

// Guardar compra en el historial del usuario actual
function guardarCompraUsuario(compra) {
    const usuarioActual = obtenerUsuarioActual();
    if (!usuarioActual) return false;
    
    const todosHistoriales = JSON.parse(localStorage.getItem("historial-compras")) || {};
    
    if (!todosHistoriales[usuarioActual.id]) {
        todosHistoriales[usuarioActual.id] = [];
    }
    
    todosHistoriales[usuarioActual.id].push(compra);
    localStorage.setItem("historial-compras", JSON.stringify(todosHistoriales));
    return true;
}

// Verificar si hay usuario logueado
function hayUsuarioLogueado() {
    return obtenerUsuarioActual() !== null;
}

// Obtener nombre del usuario (email)
function obtenerNombreUsuario() {
    const usuario = obtenerUsuarioActual();
    return usuario ? usuario.email : null;
}
