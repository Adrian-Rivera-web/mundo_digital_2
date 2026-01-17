# 01. Visión y Alcance del Proyecto

## 1. Información General
- **Nombre del Proyecto**: Mundo-Digital
- **Descripción**: E-commerce para la venta de productos electrónicos (computadoras, celulares, componentes).
- **Tipo de Negocio**: B2C (Business to Consumer) - Venta directa al consumidor final.
- **Plataforma**: Aplicación Web Responsiva (Mobile-First).

## 2. Alcance (Scope)

### 2.1 Incluido (In-Scope)
- **Catálogo de Productos**: Listado de productos electrónicos sin variantes (producto único).
- **Gestión de Usuarios**: Registro obligatorio para comprar. Roles diferenciados (Cliente, Admin, SuperAdmin).
- **Carrito de Compras**: Gestión de ítems previo a la compra.
- **Checkout y Pedidos**:
  - Selección de método de envío:
    - Retiro en Sucursal (Costo $0).
    - Envío a Domicilio (Costo fijo $4000).
  - Método de Pago: Transferencia Bancaria (Manual).
- **Gestión de Stock**: Descuento automático de stock al confirmar compra.
- **Panel de Administración (Backoffice)**:
  - Gestión de Productos (CRUD).
  - Gestión de Usuarios y Roles (SuperAdmin puede asignar roles).
  - Visualización de Pedidos.

### 2.2 Excluido (Out-of-Scope) para esta fase
- Aplicación Móvil Nativa (iOS/Android).
- Compras como invitado (Guest Checkout).
- Integración con pasarelas de pago automáticas (Stripe, Paypal, etc.).
- Cálculo de envíos en tiempo real con APIs de paquetería.
- Variantes de productos (talla, color, capacidad) - Se manejarán como productos independientes por ahora.
- Integración con ERPs externos.
- Facturación electrónica automática.

## 3. Objetivos de Negocio
- Facilitar la venta de electrónicos a clientes finales mediante una plataforma web simple y accesible.
- Gestionar el inventario de forma centralizada descontando stock por venta.
- Ofrecer opciones de logística flexibilidad (retiro vs envío).
