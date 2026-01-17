# 07. Modelo de Datos (Nivel Conceptual)

## Entidades Principales

### Usuario (User)
- **ID**: Identificador único
- **Nombre**: String
- **Apellido**: String
- **Email**: String (Único)
- **Password**: Hash
- **Rol**: Enum [CLIENTE, ADMIN, SUPERADMIN]
- **Dirección**: String (Puede ser una entidad separada si se permiten múltiples direcciones)
- **Teléfono**: String

### Producto (Product)
- **ID**: Identificador único
- **Nombre**: String
- **Descripción**: Text
- **Precio**: Decimal/Float
- **Stock**: Integer
- **ImagenUrl**: String
- **Categoría**: String

### Pedido (Order)
- **ID**: Número de orden
- **UsuarioID**: Referencia a Usuario
- **Fecha**: DateTime
- **Estado**: Enum [PENDIENTE, PAGADO, ENVIADO, ENTREGADO, CANCELADO]
- **TipoEnvío**: Enum [RETIRO, DOMICILIO]
- **CostoEnvío**: Decimal (Guardar el valor histórico, ej: 4000)
- **Total**: Decimal (Suma de productos + envío)
- **DatosEnvío**: JSON o Campos planos (Calle, CP, Ciudad) - Solo si TipoEnvío = DOMICILIO

### DetallePedido (OrderItem)
- **ID**: Identificador
- **PedidoID**: Referencia a Pedido
- **ProductoID**: Referencia a Producto
- **Cantidad**: Integer
- **PrecioUnitario**: Decimal (Precio del producto al momento de la compra)
