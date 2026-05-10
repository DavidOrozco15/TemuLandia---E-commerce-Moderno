
let productosEnCarrito = JSON.parse(localStorage.getItem('productos-en-carrito')) || [];
let ordenActual = null;


document.addEventListener('DOMContentLoaded', () => {
    initHeader();
    renderCarrito();
    initEventListeners();
    actualizarTotales();
});

function initHeader() {

    const navToggle = document.getElementById('nav-toggle');
    const navClose = document.getElementById('nav-close');
    const nav = document.getElementById('header-nav');
    
    navToggle?.addEventListener('click', () => {
        nav.classList.add('active');
    });
    
    navClose?.addEventListener('click', () => {
        nav.classList.remove('active');
    });
}


function initEventListeners() {
    document.getElementById('btn-vaciar')?.addEventListener('click', vaciarCarrito);
    
    document.getElementById('btn-checkout')?.addEventListener('click', abrirCheckout);
    
    document.getElementById('btn-historial')?.addEventListener('click', abrirHistorial);
    
    initModals();
    
    const checkoutForm = document.getElementById('checkout-form');
    checkoutForm?.addEventListener('submit', procesarCompra);
}


function renderCarrito() {
    const emptyState = document.getElementById('cart-empty');
    const content = document.getElementById('cart-content');
    const itemsList = document.getElementById('cart-items-list');
    
    if (productosEnCarrito.length === 0) {
        emptyState?.classList.add('active');
        content?.classList.remove('active');
        return;
    }
    
    emptyState?.classList.remove('active');
    content?.classList.add('active');
    
    let html = '';
    
    productosEnCarrito.forEach(producto => {
        const subtotal = producto.precio * producto.cantidad;
        
        html += `
            <div class="cart-item-card">
                <div class="cart-item-image-wrapper">
                    <img src="${producto.imagen}" alt="${producto.titulo}">
                </div>
                
                <div class="cart-item-details">
                    <div class="cart-item-category">${producto.categoria.nombre}</div>
                    <div class="cart-item-title">${producto.titulo}</div>
                    <div class="cart-item-price">$${producto.precio.toFixed(2)}</div>
                </div>
                
                <div class="cart-item-controls">
                    <button class="cart-item-remove" onclick="eliminarProducto('${producto.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                    
                    <div class="cart-item-quantity">
                        <button class="qty-btn" onclick="cambiarCantidad('${producto.id}', -1)">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span class="qty-value">${producto.cantidad}</span>
                        <button class="qty-btn" onclick="cambiarCantidad('${producto.id}', 1)">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                    
                    <div class="cart-item-subtotal">
                        Subtotal: <strong>$${subtotal.toFixed(2)}</strong>
                    </div>
                </div>
            </div>
        `;
    });
    
    if (itemsList) itemsList.innerHTML = html;
    
    actualizarTotales();
}


function cambiarCantidad(id, cambio) {
    const producto = productosEnCarrito.find(p => p.id === id);
    
    if (producto) {
        producto.cantidad += cambio;
        
        if (producto.cantidad < 1) {
            producto.cantidad = 1;
        }
        
        if (producto.cantidad > 99) {
            producto.cantidad = 99;
        }
        
        guardarCarrito();
        renderCarrito();
    }
}

function eliminarProducto(id) {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
        const index = productosEnCarrito.findIndex(p => p.id === id);
        
        if (index !== -1) {
            productosEnCarrito.splice(index, 1);
            guardarCarrito();
            renderCarrito();
            mostrarNotificacion('Producto eliminado', 'warning');
        }
    }
}

function vaciarCarrito() {
    if (confirm('¿Estás seguro de que deseas vaciar el carrito?')) {
        productosEnCarrito = [];
        guardarCarrito();
        renderCarrito();
        mostrarNotificacion('Carrito vaciado', 'warning');
    }
}

function guardarCarrito() {
    localStorage.setItem('productos-en-carrito', JSON.stringify(productosEnCarrito));
}


function actualizarTotales() {
    const subtotal = productosEnCarrito.reduce((acc, p) => acc + (p.precio * p.cantidad), 0);
    const envio = 0;

    const descuento = subtotal > 100 ? subtotal * 0.05 : 0;

    const total = subtotal + envio - descuento;
    
    const elements = {
        subtotal: document.getElementById('summary-subtotal'),
        shipping: document.getElementById('summary-shipping'),
        discount: document.getElementById('summary-discount'),
        total: document.getElementById('summary-total')
    };
    
    if (elements.subtotal) elements.subtotal.textContent = `$${subtotal.toFixed(2)}`;
    if (elements.shipping) elements.shipping.textContent = envio === 0 ? 'Gratis' : `$${envio.toFixed(2)}`;
    if (elements.discount) elements.discount.textContent = `-$${descuento.toFixed(2)}`;
    if (elements.total) elements.total.textContent = `$${total.toFixed(2)}`;
    
    return { subtotal, envio, descuento, total };
}


function abrirCheckout() {

    if (!hayUsuarioLogueado()) {
        mostrarNotificacion('Debes iniciar sesión para continuar', 'warning');
        setTimeout(() => {
            window.location.href = './index.html';
        }, 2000);
        return;
    }
    

    if (productosEnCarrito.length === 0) {
        mostrarNotificacion('Tu carrito está vacío', 'warning');
        return;
    }
    

    const email = obtenerNombreUsuario();
    const emailInput = document.getElementById('checkout-email');
    if (emailInput) emailInput.value = email;
    
    const modal = document.getElementById('checkout-modal');
    modal?.classList.add('active');
}

function cerrarCheckout() {
    const modal = document.getElementById('checkout-modal');
    modal?.classList.remove('active');
    
    const error = document.getElementById('checkout-error');
    if (error) error.textContent = '';
}

function procesarCompra(e) {
    e.preventDefault();
    
    const formData = {
        nombre: document.getElementById('checkout-name').value.trim(),
        email: document.getElementById('checkout-email').value.trim(),
        telefono: document.getElementById('checkout-phone').value.trim(),
        ciudad: document.getElementById('checkout-city').value.trim(),
        direccion: document.getElementById('checkout-address').value.trim(),
        departamento: document.getElementById('checkout-department').value.trim(),
        codigoPostal: document.getElementById('checkout-postal').value.trim(),
        metodoPago: document.getElementById('checkout-payment').value,
        notas: document.getElementById('checkout-notes').value.trim()
    };
    
    if (!formData.nombre || !formData.telefono || !formData.ciudad ||
        !formData.direccion || !formData.departamento || !formData.codigoPostal || 
        !formData.metodoPago) {
        const error = document.getElementById('checkout-error');
        if (error) error.textContent = 'Por favor completa todos los campos obligatorios';
        return;
    }
    
    const totales = actualizarTotales();
    
    const orden = {
        id: `ORDER-${Date.now()}`,
        fecha: new Date().toISOString(),
        productos: [...productosEnCarrito],
        cliente: formData,
        totales: totales,
        estado: 'completado'
    };
    
    guardarOrden(orden);
    
    productosEnCarrito = [];
    guardarCarrito();
    
    cerrarCheckout();
    
    mostrarExito(orden);
    
    document.getElementById('checkout-form').reset();
}

function mostrarExito(orden) {
    const modal = document.getElementById('success-modal');
    const details = document.getElementById('success-details');
    
    if (details) {
        details.innerHTML = `
            <div><span>Orden:</span><span>${orden.id}</span></div>
            <div><span>Productos:</span><span>${orden.productos.length} items</span></div>
            <div><span>Método de Pago:</span><span>${formatearMetodoPago(orden.cliente.metodoPago)}</span></div>
            <div><span>Total:</span><span>$${orden.totales.total.toFixed(2)}</span></div>
        `;
    }
    
    modal?.classList.add('active');
    
    renderCarrito();
    
    setTimeout(() => {
        modal?.classList.remove('active');
    }, 5000);
}

function formatearMetodoPago(metodo) {
    const metodos = {
        'efectivo': 'Efectivo contra entrega',
        'tarjeta': 'Tarjeta de crédito/débito',
        'transferencia': 'Transferencia bancaria'
    };
    return metodos[metodo] || metodo;
}


function guardarOrden(orden) {
    let historial = JSON.parse(localStorage.getItem('historial-compras')) || [];
    historial.unshift(orden);

    localStorage.setItem('historial-compras', JSON.stringify(historial));
}

function obtenerHistorial() {
    return JSON.parse(localStorage.getItem('historial-compras')) || [];
}

function abrirHistorial() {
    if (!hayUsuarioLogueado()) {
        mostrarNotificacion('Debes iniciar sesión para ver tu historial', 'warning');
        return;
    }
    
    const modal = document.getElementById('history-modal');
    const list = document.getElementById('history-list');
    const empty = document.getElementById('history-empty');
    
    const historial = obtenerHistorial();
    
    if (historial.length === 0) {
        list.innerHTML = '';
        empty?.classList.add('active');
    } else {
        empty?.classList.remove('active');
        
        let html = '';
        historial.forEach((orden, index) => {
            const fecha = new Date(orden.fecha);
            const fechaStr = fecha.toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
            html += `
                <div class="history-item" onclick="verDetalleOrden(${index})">
                    <div class="history-item-header">
                        <div>
                            <div class="history-item-date">
                                <i class="fas fa-calendar"></i>
                                ${fechaStr}
                            </div>
                            <div style="font-size: 0.75rem; color: var(--dark-600); margin-top: 0.25rem;">
                                Orden: ${orden.id}
                            </div>
                        </div>
                        <span class="history-item-status">${orden.estado}</span>
                    </div>
                    <div class="history-item-summary">
                        <div class="history-item-products">
                            <i class="fas fa-box"></i>
                            ${orden.productos.length} producto${orden.productos.length !== 1 ? 's' : ''}
                        </div>
                        <div class="history-item-total">$${orden.totales.total.toFixed(2)}</div>
                    </div>
                </div>
            `;
        });
        
        if (list) list.innerHTML = html;
    }
    
    modal?.classList.add('active');
}

function verHistorial() {
    document.getElementById('success-modal')?.classList.remove('active');
    
    abrirHistorial();
}

function verDetalleOrden(index) {
    const historial = obtenerHistorial();
    const orden = historial[index];
    
    if (!orden) return;
    
    document.getElementById('history-modal')?.classList.remove('active');
    
    const modal = document.getElementById('order-detail-modal');
    const content = document.getElementById('order-detail-content');
    
    const fecha = new Date(orden.fecha);
    const fechaStr = fecha.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    let productosHtml = '';
    orden.productos.forEach(producto => {
        const subtotal = producto.precio * producto.cantidad;
        productosHtml += `
            <div class="order-product-item">
                <img src="${producto.imagen}" alt="${producto.titulo}" class="order-product-image">
                <div class="order-product-info">
                    <h4>${producto.titulo}</h4>
                    <p>${producto.categoria.nombre}</p>
                </div>
                <div class="order-product-price">
                    <div class="price">$${subtotal.toFixed(2)}</div>
                    <div class="qty">Cantidad: ${producto.cantidad}</div>
                </div>
            </div>
        `;
    });
    
    if (content) {
        content.innerHTML = `
            <div class="order-detail-header">
                <h2>Detalle de la Orden</h2>
                <p style="color: var(--dark-600);">${fechaStr}</p>
            </div>
            
            <div class="order-detail-info">
                <div><strong>Orden:</strong><span>${orden.id}</span></div>
                <div><strong>Estado:</strong><span style="color: var(--success);">${orden.estado}</span></div>
                <div><strong>Cliente:</strong><span>${orden.cliente.nombre}</span></div>
                <div><strong>Teléfono:</strong><span>${orden.cliente.telefono}</span></div>
                <div><strong>Dirección:</strong><span>${orden.cliente.direccion}, ${orden.cliente.ciudad}</span></div>
                <div><strong>Método de Pago:</strong><span>${formatearMetodoPago(orden.cliente.metodoPago)}</span></div>
            </div>
            
            <h3 style="margin-bottom: 1rem;">Productos</h3>
            <div class="order-products-list">
                ${productosHtml}
            </div>
            
            <div class="order-total">
                <span>Total Pagado:</span>
                <span>$${orden.totales.total.toFixed(2)}</span>
            </div>
        `;
    }
    
    modal?.classList.add('active');
}

function volverHistorial() {
    document.getElementById('order-detail-modal')?.classList.remove('active');
    abrirHistorial();
}


function initModals() {
    const checkoutClose = document.getElementById('checkout-close');
    checkoutClose?.addEventListener('click', cerrarCheckout);
    
    const historyClose = document.getElementById('history-close');
    const historyModal = document.getElementById('history-modal');
    historyClose?.addEventListener('click', () => {
        historyModal?.classList.remove('active');
    });
    
    const orderClose = document.getElementById('order-detail-close');
    const orderModal = document.getElementById('order-detail-modal');
    orderClose?.addEventListener('click', () => {
        orderModal?.classList.remove('active');
    });
    
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            e.target.closest('.modal')?.classList.remove('active');
        });
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal.active').forEach(modal => {
                modal.classList.remove('active');
            });
        }
    });
}


function mostrarNotificacion(mensaje, tipo = 'info') {
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
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${tipo}`;
    
    const colors = {
        success: '#10b981',
        danger: '#ef4444',
        warning: '#f59e0b',
        info: '#6366f1'
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
        border-radius: 12px;
        box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1);
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
        <button onclick="this.parentElement.remove()" style="color: #475569; font-size: 1.25rem; cursor: pointer;">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    container.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

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


window.cambiarCantidad = cambiarCantidad;
window.eliminarProducto = eliminarProducto;
window.cerrarCheckout = cerrarCheckout;
window.verHistorial = verHistorial;
window.verDetalleOrden = verDetalleOrden;
window.volverHistorial = volverHistorial;
