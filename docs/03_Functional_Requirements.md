# 03. Requerimientos Funcionales

## Módulo 1: Autenticación y Usuarios
- **RF-001 Registro de Usuarios**: El sistema debe permitir el registro de nuevos usuarios solicitando: Nombre, Apellido, Email, Contraseña, Teléfono.
- **RF-002 Inicio de Sesión**: Ingreso mediante Email y Contraseña.
- **RF-003 Recuperación de Contraseña**: (Opcional fase 1) Mecanismo para resetear contraseña via email.
- **RF-004 Perfil de Usuario**: El usuario puede ver y editar sus datos personales y direcciones de envío guardadas.

## Módulo 2: Catálogo (Frontend)
- **RF-005 Listado de Productos**: Visualización de productos en grilla con Imagen, Nombre, Precio.
- **RF-006 Detalle de Producto**: Página con descripción completa, especificaciones técnicas, precio, stock disponible y botón "Agregar al Carrito".
- **RF-007 Búsqueda y Filtros**: Barra de búsqueda por nombre y filtros básicos por categoría.
- **RF-008 Control de Stock visible**: Mostrar si hay stock disponible. Si stock = 0, deshabilitar compra.

## Módulo 3: Carrito de Compras
- **RF-009 Agregar ítems**: Permitir agregar productos y seleccionar cantidad (limitado por stock actual).
- **RF-010 Visualizar Carrito**: Ver lista de productos, precios unitarios, subtotales y total estimado.
- **RF-011 Modificar Carrito**: Eliminar ítems o actualizar cantidades.

## Módulo 4: Checkout y Pedidos
- **RF-012 Selección de Envío**:
  - Opción A: "Retiro en Sucursal" -> Costo $0.
  - Opción B: "Envío a Domicilio" -> Costo agregado de $4000. Solicitar dirección completa (Calle, Número, Colonia, Ciudad, CP).
- **RF-013 Confirmación de Pago**: Mostrar instrucciones para transferencia bancaria (Banco, CLABE, instrucciones de referencia).
- **RF-014 Generación de Pedido**: Crear el pedido con estado inicial "Pendiente de Pago".
- **RF-015 Historial de Pedidos**: El cliente puede ver sus pedidos anteriores y su estado actual.

## Módulo 5: Administración (Backoffice)
- **RF-016 Gestión de Productos**:
  - Crear, Editar, Eliminar (Soft Delete) productos.
  - Campos: Nombre, Descripción, Precio, Stock, Imagen (URL o Carga), Categoría.
- **RF-017 Gestión de Stock Manual**: Ajustar cantidad de stock disponible directamente.
- **RF-018 Gestión de Pedidos**:
  - Listar pedidos (Filtros: Pendiente, Pagado, Entregado).
  - Detalle de pedido (Ver productos, datos de cliente y envío).
  - Cambio de Estado: De "Pendiente" a "Pagado" (tras verificar transferencia), "Enviado", "Entregado".
- **RF-019 Gestión de Usuarios (Admin)**: Ver lista de usuarios registrados.
- **RF-020 Gestión de Roles (SuperAdmin)**:
  - Listar todos los usuarios.
  - Asignar/Revocar rol de "Administrador".
  - Solo el SuperAdmin puede realizar esta acción.
