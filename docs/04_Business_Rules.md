# 04. Reglas de Negocio

## RN-01: Precios y Moneda
- Todos los precios están en Pesos (MXN implícito por el contexto, o moneda local definida).
- Los precios mostrados incluyen impuestos (si aplica) o se definirá si se desglosan al final (Por defecto: Precios finales).

## RN-02: Envíos
- **Costo Fijo**: El envío a domicilio tiene un costo único e invariable de **$4000** (moneda local).
- **Retiro**: El retiro en sucursal no tiene costo.
- **Datos de Envío**: Son obligatorios si se selecciona "Envío a Domicilio".

## RN-03: Stock e Inventario
- **Reserva de Stock**: El stock se descuenta temporalmente al confirmar el pedido (estado Pendiente).
- **Stock Insuficiente**: No se permite agregar al carrito una cantidad mayor a la disponible.
- **Sin Stock**: Productos con stock 0 no pueden ser comprados (Botón deshabilitado o etiqueta "Agotado").

## RN-04: Pagos y Estados de Pedido
- El sistema no procesa el pago automáticamente. Se asume "Buena Fe" del usuario para realizar la transferencia.
- **Estados del Pedido**:
  1.  **Pendiente**: Pedido creado, stock descontado, esperando transferencia.
  2.  **Pagado/Procesando**: El admin verificó la transferencia en su banco y marca el pedido manualmenente.
  3.  **Enviado/Listo para Retiro**: El pedido salió del almacén o está listo en mostrador.
  4.  **Entregado/Finalizado**: El cliente recibió el producto.
  5.  **Cancelado**: Si no se paga o no hay stock real, se revierte la operación y se devuelve el stock (si aplica lógica de reversión automática o manual).

## RN-05: Jerarquía de Roles
- Un **Usuario** (Cliente) solo accede al Frontend (Storefront).
- Un **Admin** accede al Backoffice pero NO puede modificar roles de otros usuarios.
- Un **SuperAdmin** tiene acceso total y es el único que puede promover a un Usuario a Admin o revocar permisos.
