# FoodFlow - Sistema de Gestión de Pedidos

## 📋 Descripción

FoodFlow es una aplicación web moderna y responsiva para la gestión de pedidos de restaurantes. Ofrece una interfaz intuitiva para crear, editar y seguir el estado de pedidos, con análisis en tiempo real y un diseño adaptable tanto para dispositivos móviles como de escritorio.

## ✨ Funcionalidades

### 🎯 Gestión de Pedidos
- Creación de nuevos pedidos con sistema de carrito
- Edición de pedidos existentes en tiempo real
- Seguimiento de estados: Pendiente, En Preparación, Listo
- Visualización de historial de pedidos completados

### 🏷️ Gestión de Productos
- Catálogo de productos organizado por categorías
- Sistema de búsqueda de productos
- Precios y cantidades configurables
- Interfaz visual atractiva con iconos

### 📊 Analytics
- Dashboard con métricas clave
- Gráficos de ventas semanales
- Estadísticas de rendimiento (pedidos diarios, ingresos, etc.)
- Datos en tiempo real

### 🎨 Experiencia de Usuario
- Diseño moderno con animaciones fluidas
- Modo claro/oscuro configurable
- Interfaz completamente responsiva
- Navegación intuitiva con menú móvil
- Efectos visuales y transiciones suaves

## 🛠️ Tecnologías Utilizadas

### Frontend
- **HTML5** - Estructura semántica
- **CSS3** - Estilos con variables CSS y diseño moderno
- **JavaScript (ES6+)** - Funcionalidad e interacciones
- **Anime.js** - Biblioteca de animaciones
- **Font Awesome** - Iconografía

### Backend (Futuro)
- **Node.js** - Entorno de ejecución
- **Express.js** - Framework web
- **MongoDB** - Base de datos
- **Mongoose** - ODM para MongoDB
- **JSON Server** - API simulada (actual)

## 📦 Dependencias

```json
{
  "dependencies": {
    "animejs": "^3.2.1",
    "font-awesome": "^6.4.0"
  }
}
```

## 🚀 Instalación y Ejecución

1. Clona el repositorio:
```bash
git clone <url-del-repositorio>
cd foodflow
```

2. Instala las dependencias:
```bash
npm install
# o
yarn install
```

3. Inicia el servidor de desarrollo:
```bash
npm start
# o
yarn start
```

4. Abre tu navegador en `http://localhost:3000`

## 📁 Estructura del Proyecto

```
foodflow/
├── index.html          # Página principal
├── css/
│   └── style.css       # Estilos principales
├── js/
│   ├── script.js       # Lógica principal de la aplicación
│   └── animation.js    # Animaciones y efectos
├── assets/             # Imágenes e iconos
└── README.md           # Documentación
```

## 🔌 Funciones Principales

### Gestión de Estado
- `currentOrder` - Almacena el pedido actual en curso
- `updateOrderSummary()` - Actualiza el resumen del pedido
- `calculateOrderTotal()` - Calcula totales con impuestos y propinas

### Navegación
- `setActiveSection()` - Cambia entre secciones de la aplicación
- Gestión de temas claro/oscuro

### Comunicación con API
- Conexión con API en `http://localhost:4000`
- Funciones para CRUD de pedidos y productos

## 🔮 Futuras Características

### 📈 Sistema de Analytics Avanzado
- Seguimiento de métricas de rendimiento detalladas
- Gráficos interactivos y personalizables
- Reportes exportables en PDF/Excel
- Análisis de tendencias y predicciones

### 🗄️ Base de Datos
- Migración a MongoDB para persistencia de datos
- Esquemas para usuarios, productos y pedidos
- Consultas optimizadas para grandes volúmenes de datos
- Sistema de backups automatizados

### 📋 Historial Avanzado
- Filtrado y búsqueda en historial de pedidos
- Exportación de historial por rangos de fecha
- Estadísticas históricas comparativas
- Sistema de etiquetas y categorización

### 👥 Sistema de Usuarios
- Registro y autenticación de usuarios
- Roles y permisos (admin, empleado, cliente)
- Perfiles de usuario personalizables
- Historial de pedidos por usuario
- Productos favoritos y personalizados

### 🛒 Características de E-commerce
- Carrito de compras persistente
- Sistema de direcciones de envío
- Métodos de pago integrados
- Sistema de cupones y descuentos
- Programación de pedidos recurrentes

### 📱 Panel de Administración
- Dashboard completo con métricas
- Gestión de usuarios y permisos
- Control de inventario en tiempo real
- Editor de productos y categorías
- Sistema de notificaciones push

### 🔄 Migración al Stack MERN
- [ ] Implementar backend con Node.js y Express
- [ ] Diseñar esquemas de MongoDB con Mongoose
- [ ] Crear API RESTful completa
- [ ] Implementar autenticación con JWT
- [ ] Sistema de archivos para imágenes de productos
- [ ] Middleware de validación y seguridad
- [ ] Sistema de caché para mejor rendimiento
- [ ] Implementar WebSockets para actualizaciones en tiempo real

## 🤝 Contribución

Las contribuciones son bienvenidas. Por favor, lee las guías de contribución antes de enviar un pull request.

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

Si tienes preguntas o problemas, abre un issue en el repositorio o contacta al equipo de desarrollo.
