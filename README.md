# 🛍️ TemuLandia - E-commerce Moderno

## 📋 Descripción

TemuLandia es una landing page moderna de e-commerce completamente rediseñada con un enfoque profesional y elegante. El proyecto incluye todas las funcionalidades de una tienda en línea moderna:

- ✨ Diseño landing page profesional
- 🎨 Interfaz moderna y atractiva
- 📱 Totalmente responsive
- 🛒 Sistema de carrito completo
- 👤 Autenticación de usuarios
- 📦 Gestión de productos
- 📊 Historial de compras
- 💳 Proceso de checkout completo

## 🚀 Características Principales

### Diseño Moderno
- **Header Horizontal**: Logo, navegación y carrito en la parte superior
- **Hero Section**: Carrusel elegante con productos destacados de cada categoría
- **Sección de Categorías**: Grid 2x2 con imágenes de alta calidad y efectos hover
- **Sección de Servicios**: 4 íconos informativos (envíos, garantía, soporte, pagos)
- **Productos Grid**: Diseño en tarjetas con filtros y ordenamiento
- **Footer Completo**: Información, enlaces y redes sociales

### Funcionalidades
- 🔍 **Búsqueda en tiempo real**
- 🏷️ **Filtros por categoría**
- 📊 **Ordenamiento** (precio, nombre)
- 🛒 **Carrito dropdown** con animaciones elegantes
- 📄 **Modal de detalles** de productos
- 👤 **Login/Registro** de usuarios
- 💰 **Proceso de compra** completo
- 📜 **Historial de pedidos**
- 🎨 **Animaciones suaves** con AOS

### Tecnologías Utilizadas

#### Frontend
- **HTML5** - Estructura semántica
- **CSS3** - Diseño moderno con variables CSS
- **JavaScript** (Vanilla) - Lógica de la aplicación

#### Librerías
- **Swiper.js** - Carrusel del hero
- **AOS (Animate On Scroll)** - Animaciones al scroll
- **Font Awesome 6** - Iconografía
- **Google Fonts** (Inter + Playfair Display) - Tipografías

#### API
- **Fake Store API** - Productos de demostración
- **Unsplash** - Imágenes de alta calidad

## 📁 Estructura del Proyecto

```
TemuLandia-Redesign/
│
├── index.html              # Página principal
├── carrito.html           # Página del carrito
│
├── css/
│   ├── styles.css         # Estilos principales
│   └── carrito.css        # Estilos del carrito
│
├── js/
│   ├── app.js             # JavaScript principal
│   ├── carrito.js         # JavaScript del carrito
│   └── auth.js            # Sistema de autenticación
│
└── README.md              # Este archivo
```

## 🎨 Paleta de Colores

- **Primary**: #6366f1 (Índigo)
- **Secondary**: #ec4899 (Rosa)
- **Dark**: #0f172a (Azul oscuro)
- **Light**: #f8fafc (Gris claro)
- **Success**: #10b981 (Verde)
- **Warning**: #f59e0b (Naranja)
- **Danger**: #ef4444 (Rojo)

## 💻 Instalación y Uso

### Opción 1: Uso Local Simple

1. **Descomprime** el archivo ZIP
2. **Abre** `index.html` en tu navegador
3. ¡Listo! La aplicación funciona completamente

### Opción 2: Servidor Local

Para mejor rendimiento y evitar problemas de CORS:

```bash
# Con Python 3
python -m http.server 8000

# Con Node.js (npx)
npx http-server

# Con PHP
php -S localhost:8000
```

Luego abre: `http://localhost:8000`

## 📖 Guía de Uso

### Para Usuarios

1. **Navegar**: Explora las categorías y productos
2. **Buscar**: Usa el buscador para encontrar productos específicos
3. **Filtrar**: Filtra por categoría y ordena los resultados
4. **Ver detalles**: Haz clic en "Ver más" para información completa
5. **Agregar al carrito**: Haz clic en el botón de carrito
6. **Ver carrito**: Haz clic en el ícono del carrito en el header
7. **Comprar**: 
   - Primero debes **registrarte** o **iniciar sesión**
   - Completa el formulario de entrega
   - Confirma tu compra
8. **Historial**: Ver tus compras anteriores

### Funcionalidades del Carrito

- ✅ Aumentar/Disminuir cantidad
- ❌ Eliminar productos
- 🗑️ Vaciar carrito completo
- 💰 Ver totales en tiempo real
- 🚚 Envío gratis incluido
- 🎁 Descuento automático (5% en compras >$100)

### Sistema de Autenticación

- Registro con email y contraseña
- Login seguro
- Persistencia de sesión (LocalStorage)
- Protección de rutas (checkout requiere login)

## 🎯 Mejoras Implementadas

### vs. Versión Original

1. **Diseño Completamente Renovado**
   - Header horizontal moderno
   - Hero con carrusel animado
   - Categorías con imágenes de alta calidad
   - Sección de servicios informativa

2. **Experiencia de Usuario Mejorada**
   - Carrito dropdown animado
   - Notificaciones elegantes
   - Modales modernos con animaciones
   - Transiciones suaves en toda la app

3. **Funcionalidades Nuevas**
   - Búsqueda en tiempo real
   - Filtros más intuitivos
   - Historial de compras detallado
   - Formulario de checkout completo

4. **Diseño Responsive Premium**
   - Mobile-first approach
   - Breakpoints optimizados
   - Touch-friendly en móviles

5. **Performance Optimizado**
   - Lazy loading de imágenes
   - Animaciones optimizadas
   - Código modular y limpio

## 📱 Responsive Design

La aplicación está optimizada para:

- 📱 **Mobile**: 320px - 767px
- 📱 **Tablet**: 768px - 1023px
- 💻 **Desktop**: 1024px+
- 🖥️ **Large Desktop**: 1280px+

## 🔒 Seguridad

- Validación de formularios en frontend
- Sanitización de inputs
- Protección contra XSS básica
- Persistencia segura en LocalStorage

**Nota**: Para producción, se recomienda implementar autenticación backend real y encriptación de datos sensibles.

## 📊 Datos de Prueba

El sitio usa datos de la **Fake Store API**:
- ~20 productos
- 4 categorías
- Datos reales de productos

Para testing del sistema de login:
- Puedes crear cualquier cuenta de prueba
- Los datos se guardan en LocalStorage

## 🛠️ Personalización

### Cambiar Colores

Edita las variables CSS en `css/styles.css`:

```css
:root {
    --primary: #6366f1;        /* Color principal */
    --secondary: #ec4899;      /* Color secundario */
    --dark: #0f172a;           /* Color oscuro */
    /* ... más variables ... */
}
```

### Cambiar Fuentes

Modifica el `<link>` de Google Fonts en el HTML:

```html
<link href="https://fonts.googleapis.com/css2?family=TuFuente&display=swap" rel="stylesheet">
```

### Agregar Productos Propios

Reemplaza la llamada a la API en `js/app.js`:

```javascript
async function cargarProductos() {
    // Usa tu propia API o datos
    const productos = await fetch('tu-api.com/productos');
    // ...
}
```

## 🐛 Solución de Problemas

### El carrusel no se mueve
- Verifica que Swiper.js esté cargando correctamente
- Revisa la consola del navegador

### Las imágenes no cargan
- Comprueba tu conexión a internet
- Unsplash API puede tener límites de requests

### El LocalStorage no funciona
- Verifica que tu navegador permita LocalStorage
- Modo incógnito puede bloquear LocalStorage

## 📝 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 👨‍💻 Autor

**Dyonix**
- Proyecto: TemuLandia
- Año: 2025

## 🙏 Agradecimientos

- **Fake Store API** - Por los datos de productos
- **Unsplash** - Por las imágenes de alta calidad
- **Font Awesome** - Por los iconos
- **Swiper.js** - Por el excelente carrusel
- **AOS** - Por las animaciones al scroll

---

## 🚀 Próximas Mejoras

Ideas para futuras versiones:

- [ ] Backend real con Node.js/Express
- [ ] Base de datos (MongoDB/PostgreSQL)
- [ ] Pagos reales (Stripe/PayPal)
- [ ] Panel de administración
- [ ] Sistema de reviews y ratings
- [ ] Wishlist (lista de deseos)
- [ ] Comparador de productos
- [ ] Chat de soporte en vivo
- [ ] Multi-idioma
- [ ] PWA (Progressive Web App)

---

**¡Gracias por usar TemuLandia! 🎉**

Si tienes preguntas o sugerencias, no dudes en contactar.
