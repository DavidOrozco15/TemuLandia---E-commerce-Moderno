// ================================
// VARIABLES GLOBALES
// ================================
let productos = [];
let productosFiltrados = [];
let productosEnCarrito = JSON.parse(localStorage.getItem('productos-en-carrito')) || [];
let categoriaActiva = 'todos';
let currentSwiper = null;

// ================================
// INICIALIZACIÓN
// ================================
document.addEventListener('DOMContentLoaded', () => {
    initAOS();
    initHeader();
    initSearch();
    initCart();
    initModals();
    cargarProductos();
    actualizarCarritoBadge();
    actualizarAuthButton();
});

// ================================
// AOS ANIMATION
// ================================
function initAOS() {
    AOS.init({
        duration: 800,
        once: true,
        offset: 100,
    });
}

// ================================
// HEADER
// ================================
function initHeader() {
    const navToggle = document.getElementById('nav-toggle');
    const navClose = document.getElementById('nav-close');
    const nav = document.getElementById('header-nav');
    const navLinks = document.querySelectorAll('.nav-link');
    
    navToggle?.addEventListener('click', () => {
        nav.classList.add('active');
    });
    
    navClose?.addEventListener('click', () => {
        nav.classList.remove('active');
    });
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            navLinks.forEach(l => l.classList.remove('active'));
            e.currentTarget.classList.add('active');
            nav.classList.remove('active');
        });
    });
    
    // Header scroll effect
    let lastScroll = 0;
    const header = document.getElementById('header');
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.style.boxShadow = 'var(--shadow-lg)';
        } else {
            header.style.boxShadow = 'var(--shadow)';
        }
        
        lastScroll = currentScroll;
    });
}

// ================================
// SEARCH
// ================================
function initSearch() {
    const searchBtn = document.getElementById('search-btn');
    const searchBar = document.getElementById('search-bar');
    const searchClose = document.getElementById('search-close');
    const searchInput = document.getElementById('search-input');
    
    searchBtn?.addEventListener('click', () => {
        searchBar.classList.add('active');
        setTimeout(() => searchInput.focus(), 300);
    });
    
    searchClose?.addEventListener('click', () => {
        searchBar.classList.remove('active');
        searchInput.value = '';
        filtrarProductos();
    });
    
    searchInput?.addEventListener('input', (e) => {
        filtrarProductos();
    });
}

// ================================
// CART DROPDOWN
// ================================
function initCart() {
    const cartBtn = document.getElementById('cart-btn');
    const cartDropdown = document.getElementById('cart-dropdown');
    const cartClose = document.getElementById('cart-dropdown-close');
    
    cartBtn?.addEventListener('click', () => {
        cartDropdown.classList.toggle('active');
        renderCartDropdown();
    });
    
    cartClose?.addEventListener('click', () => {
        cartDropdown.classList.remove('active');
    });
    
    // Cerrar al hacer click fuera
    document.addEventListener('click', (e) => {
        if (!cartBtn?.contains(e.target) && !cartDropdown?.contains(e.target)) {
            cartDropdown?.classList.remove('active');
        }
    });
}

function renderCartDropdown() {
    const cartBody = document.getElementById('cart-dropdown-body');
    const cartTotal = document.getElementById('cart-total-dropdown');
    
    if (productosEnCarrito.length === 0) {
        cartBody.innerHTML = '<p class="cart-empty">Tu carrito está vacío</p>';
        cartTotal.textContent = '$0.00';
        return;
    }
    
    let html = '';
    let total = 0;
    
    productosEnCarrito.forEach(producto => {
        const subtotal = producto.precio * producto.cantidad;
        total += subtotal;
        
        html += `
            <div class="cart-item">
                <img src="${producto.imagen}" alt="${producto.titulo}" class="cart-item-image">
                <div class="cart-item-info">
                    <div class="cart-item-title">${producto.titulo}</div>
                    <div class="cart-item-price">$${producto.precio.toFixed(2)}</div>
                    <div class="cart-item-quantity">Cantidad: ${producto.cantidad}</div>
                </div>
                <button class="cart-item-remove" onclick="eliminarDelCarrito('${producto.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    });
    
    cartBody.innerHTML = html;
    cartTotal.textContent = `$${total.toFixed(2)}`;
}

function eliminarDelCarrito(id) {
    const index = productosEnCarrito.findIndex(p => p.id === id);
    
    if (index !== -1) {
        productosEnCarrito.splice(index, 1);
        localStorage.setItem('productos-en-carrito', JSON.stringify(productosEnCarrito));
        renderCartDropdown();
        actualizarCarritoBadge();
        
        // Mostrar notificación
        mostrarNotificacion('Producto eliminado del carrito', 'warning');
    }
}

function actualizarCarritoBadge() {
    const badge = document.getElementById('cart-badge');
    const cantidad = productosEnCarrito.reduce((acc, p) => acc + p.cantidad, 0);
    if (badge) badge.textContent = cantidad;
}

// ================================
// PRODUCTOS
// ================================
async function cargarProductos() {
    try {
        const response = await fetch('https://fakestoreapi.com/products');
        const data = await response.json();
        
        productos = data.map(p => ({
            id: `producto-${p.id}`,
            titulo: p.title,
            imagen: p.image,
            descripcion: p.description,
            categoria: {
                nombre: p.category,
                id: p.category.toLowerCase().replace(/['\s]+/g, '-')
            },
            precio: p.price
        }));
        
        productosFiltrados = [...productos];
        
        renderProductos();
        initHeroSwiper();
        initFilters();
        
    } catch (error) {
        console.error('Error al cargar productos:', error);
        mostrarNotificacion('Error al cargar productos', 'danger');
    }
}

function renderProductos() {
    const grid = document.getElementById('products-grid');
    
    if (productosFiltrados.length === 0) {
        grid.innerHTML = `
            <div class="products-loading">
                <i class="fas fa-search" style="font-size: 3rem; color: var(--dark-600);"></i>
                <p>No se encontraron productos</p>
            </div>
        `;
        return;
    }
    
    let html = '';
    
    productosFiltrados.forEach((producto, index) => {
        html += `
            <div class="product-card" data-aos="fade-up" data-aos-delay="${index * 50}">
                <div class="product-image-wrapper">
                    <img src="${producto.imagen}" alt="${producto.titulo}" class="product-image">
                </div>
                <div class="product-info">
                    <div class="product-category">${producto.categoria.nombre}</div>
                    <h3 class="product-title">${producto.titulo}</h3>
                    <div class="product-price">$${producto.precio.toFixed(2)}</div>
                    <div class="product-actions">
                        <button class="product-btn product-btn-details" onclick="abrirModalProducto('${producto.id}')">
                            <i class="fas fa-eye"></i>
                            Ver más
                        </button>
                        <button class="product-btn product-btn-cart" onclick="agregarAlCarrito('${producto.id}')">
                            <i class="fas fa-cart-plus"></i>
                            Agregar
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
    
    grid.innerHTML = html;
    AOS.refresh();
}

// ================================
// FILTROS
// ================================
function initFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn, .category-btn');
    const sortSelect = document.getElementById('sort-select');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const filter = e.currentTarget.dataset.filter;
            
            // Actualizar botones activos
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            if (e.currentTarget.classList.contains('filter-btn')) {
                e.currentTarget.classList.add('active');
            }
            
            categoriaActiva = filter;
            filtrarProductos();
            
            // Scroll a productos
            document.getElementById('productos')?.scrollIntoView({ behavior: 'smooth' });
        });
    });
    
    sortSelect?.addEventListener('change', () => {
        filtrarProductos();
    });
}

function filtrarProductos() {
    const searchInput = document.getElementById('search-input');
    const sortSelect = document.getElementById('sort-select');
    const textoBusqueda = searchInput?.value.toLowerCase().trim() || '';
    
    // Filtrar por categoría
    if (categoriaActiva === 'todos') {
        productosFiltrados = [...productos];
    } else {
        productosFiltrados = productos.filter(p => p.categoria.id === categoriaActiva);
    }
    
    // Filtrar por búsqueda
    if (textoBusqueda) {
        productosFiltrados = productosFiltrados.filter(p => 
            p.titulo.toLowerCase().includes(textoBusqueda) ||
            p.categoria.nombre.toLowerCase().includes(textoBusqueda)
        );
    }
    
    // Ordenar
    const criterio = sortSelect?.value || 'default';
    ordenarProductos(criterio);
    
    renderProductos();
}

function ordenarProductos(criterio) {
    switch (criterio) {
        case 'price-asc':
            productosFiltrados.sort((a, b) => a.precio - b.precio);
            break;
        case 'price-desc':
            productosFiltrados.sort((a, b) => b.precio - a.precio);
            break;
        case 'name-asc':
            productosFiltrados.sort((a, b) => a.titulo.localeCompare(b.titulo));
            break;
        case 'name-desc':
            productosFiltrados.sort((a, b) => b.titulo.localeCompare(a.titulo));
            break;
    }
}

// ================================
// CARRITO - AGREGAR
// ================================
function agregarAlCarrito(id) {
    const producto = productos.find(p => p.id === id);
    
    if (!producto) return;
    
    const existe = productosEnCarrito.find(p => p.id === id);
    
    if (existe) {
        existe.cantidad++;
        mostrarNotificacion(`Cantidad actualizada: ${existe.cantidad}`, 'success');
    } else {
        productosEnCarrito.push({ ...producto, cantidad: 1 });
        mostrarNotificacion('Producto agregado al carrito', 'success');
    }
    
    localStorage.setItem('productos-en-carrito', JSON.stringify(productosEnCarrito));
    actualizarCarritoBadge();
}

// ================================
// HERO SWIPER
// ================================
function initHeroSwiper() {
    const wrapper = document.getElementById('hero-swiper-wrapper');
    
    const categorias = ['electronics', 'jewelery', 'men-s-clothing', 'women-s-clothing'];
    const productosHero = [];
    
    categorias.forEach(cat => {
        const producto = productos.find(p => p.categoria.id === cat);
        if (producto) productosHero.push(producto);
    });
    
    let html = '';
    productosHero.forEach((producto, index) => {
        const backgrounds = [
            'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
        ];
        
        html += `
            <div class="swiper-slide hero-slide" style="background: ${backgrounds[index]}">
                <div class="hero-overlay"></div>
                <div class="container" style="height: 100%; display: flex; align-items: center; position: relative; z-index: 10;">
                    <div class="hero-content">
                        <div class="hero-category">${producto.categoria.nombre}</div>
                        <h2 class="hero-title">${producto.titulo.length > 50 ? producto.titulo.substring(0, 50) + '...' : producto.titulo}</h2>
                        <p class="hero-description">${producto.descripcion.substring(0, 150)}...</p>
                        <div class="hero-price">$${producto.precio.toFixed(2)}</div>
                        <div class="hero-buttons">
                            <button class="hero-btn" onclick="verCategoria('${producto.categoria.id}')">
                                Ver Categoría
                                <i class="fas fa-arrow-right"></i>
                            </button>
                            <button class="hero-btn-secondary" onclick="abrirModalProducto('${producto.id}')">
                                Ver Detalles
                                <i class="fas fa-eye"></i>
                            </button>
                        </div>
                    </div>
                    <div class="hero-image-wrapper">
                        <img src="${producto.imagen}" alt="${producto.titulo}" class="hero-product-image">
                    </div>
                </div>
            </div>
        `;
    });
    
    wrapper.innerHTML = html;
    
    currentSwiper = new Swiper('.hero-swiper', {
        loop: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        speed: 800,
        effect: 'fade',
        fadeEffect: {
            crossFade: true
        }
    });
}

function verCategoria(categoriaId) {
    // Actualizar filtro
    categoriaActiva = categoriaId;
    
    // Actualizar botones
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.filter === categoriaId) {
            btn.classList.add('active');
        }
    });
    
    // Filtrar y mostrar
    filtrarProductos();
    
    // Scroll a productos
    document.getElementById('productos')?.scrollIntoView({ behavior: 'smooth' });
}

// ================================
// MODALS
// ================================
function initModals() {
    // Auth Modal
    const authBtn = document.getElementById('auth-btn');
    const authModal = document.getElementById('auth-modal');
    const authClose = document.getElementById('auth-modal-close');
    const authOverlay = document.getElementById('auth-modal-overlay');
    const authTabs = document.querySelectorAll('.auth-tab');
    
    authBtn?.addEventListener('click', () => {
        if (hayUsuarioLogueado()) {
            cerrarSesion();
        } else {
            authModal?.classList.add('active');
        }
    });
    
    authClose?.addEventListener('click', () => {
        authModal?.classList.remove('active');
    });
    
    authOverlay?.addEventListener('click', () => {
        authModal?.classList.remove('active');
    });
    
    authTabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            const tabName = e.currentTarget.dataset.tab;
            
            authTabs.forEach(t => t.classList.remove('active'));
            e.currentTarget.classList.add('active');
            
            document.querySelectorAll('.auth-panel').forEach(panel => {
                panel.classList.remove('active');
            });
            
            document.getElementById(`${tabName}-panel`)?.classList.add('active');
        });
    });
    
    // Auth Forms
    initAuthForms();
}

function initAuthForms() {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    
    loginForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value;
        const errorMsg = document.getElementById('login-error');
        
        const resultado = loginUsuario(email, password);
        
        if (resultado.exito) {
            errorMsg.textContent = '';
            loginForm.reset();
            document.getElementById('auth-modal')?.classList.remove('active');
            actualizarAuthButton();
            mostrarNotificacion('¡Bienvenido de nuevo!', 'success');
        } else {
            errorMsg.textContent = resultado.mensaje;
        }
    });
    
    registerForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = document.getElementById('register-email').value.trim();
        const password = document.getElementById('register-password').value;
        const confirm = document.getElementById('register-confirm').value;
        const errorMsg = document.getElementById('register-error');
        
        if (password !== confirm) {
            errorMsg.textContent = 'Las contraseñas no coinciden';
            return;
        }
        
        const resultado = registrarUsuario(email, password);
        
        if (resultado.exito) {
            errorMsg.textContent = '';
            loginUsuario(email, password);
            registerForm.reset();
            document.getElementById('auth-modal')?.classList.remove('active');
            actualizarAuthButton();
            mostrarNotificacion('¡Cuenta creada exitosamente!', 'success');
        } else {
            errorMsg.textContent = resultado.mensaje;
        }
    });
}

function abrirModalProducto(id) {
    const producto = productos.find(p => p.id === id);
    if (!producto) return;
    
    const modal = document.getElementById('product-modal');
    const modalBody = document.getElementById('product-modal-body');
    
    modalBody.innerHTML = `
        <img src="${producto.imagen}" alt="${producto.titulo}" class="modal-product-image">
        <div class="modal-product-info">
            <div class="modal-product-category">${producto.categoria.nombre}</div>
            <h2 class="modal-product-title">${producto.titulo}</h2>
            <div class="modal-product-price">$${producto.precio.toFixed(2)}</div>
            <p class="modal-product-description">${producto.descripcion}</p>
            <div class="modal-product-actions">
                <button class="btn btn-outline" onclick="cerrarModal('product-modal')">
                    Cerrar
                </button>
                <button class="btn btn-primary" onclick="agregarAlCarrito('${producto.id}'); cerrarModal('product-modal')">
                    <i class="fas fa-cart-plus"></i>
                    Agregar al Carrito
                </button>
            </div>
        </div>
    `;
    
    modal?.classList.add('active');
    
    // Event listeners para cerrar
    const closeBtn = document.getElementById('product-modal-close');
    const overlay = document.getElementById('product-modal-overlay');
    
    closeBtn?.addEventListener('click', () => cerrarModal('product-modal'));
    overlay?.addEventListener('click', () => cerrarModal('product-modal'));
}

function cerrarModal(modalId) {
    const modal = document.getElementById(modalId);
    modal?.classList.remove('active');
}

function actualizarAuthButton() {
    const authText = document.getElementById('auth-text');
    const authBtn = document.getElementById('auth-btn');
    
    if (hayUsuarioLogueado()) {
        const usuario = obtenerNombreUsuario();
        if (authText) authText.textContent = 'Salir';
        if (authBtn) authBtn.title = `Usuario: ${usuario}`;
    } else {
        if (authText) authText.textContent = 'Ingresar';
        if (authBtn) authBtn.title = 'Iniciar sesión o registrarse';
    }
}

// ================================
// NOTIFICACIONES
// ================================
function mostrarNotificacion(mensaje, tipo = 'info') {
    // Crear contenedor si no existe
    let container = document.querySelector('.notifications-container');
    
    if (!container) {
        container = document.createElement('div');
        container.className = 'notifications-container';
        container.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            z-index: 10000;
            display: flex;
            flex-direction: column;
            gap: 1rem;
        `;
        document.body.appendChild(container);
    }
    
    // Crear notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${tipo}`;
    
    const colors = {
        success: 'var(--success)',
        danger: 'var(--danger)',
        warning: 'var(--warning)',
        info: 'var(--primary)'
    };
    
    const icons = {
        success: 'fa-check-circle',
        danger: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    
    notification.style.cssText = `
        background: white;
        padding: 1rem 1.5rem;
        border-radius: var(--border-radius);
        box-shadow: var(--shadow-lg);
        display: flex;
        align-items: center;
        gap: 1rem;
        min-width: 300px;
        animation: slideInRight 0.3s ease;
        border-left: 4px solid ${colors[tipo]};
    `;
    
    notification.innerHTML = `
        <i class="fas ${icons[tipo]}" style="color: ${colors[tipo]}; font-size: 1.25rem;"></i>
        <span style="flex: 1; font-weight: 500;">${mensaje}</span>
        <button onclick="this.parentElement.remove()" style="color: var(--dark-600); font-size: 1.25rem;">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    container.appendChild(notification);
    
    // Auto-remove después de 3 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Agregar animaciones CSS para notificaciones
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ================================
// FUNCIONES GLOBALES (para onclick)
// ================================
window.agregarAlCarrito = agregarAlCarrito;
window.eliminarDelCarrito = eliminarDelCarrito;
window.abrirModalProducto = abrirModalProducto;
window.cerrarModal = cerrarModal;
window.verCategoria = verCategoria;
