# 06. Flujos de Usuario (User Flows)

## Flujo 1: Registro y Compra (Cliente)
Este flujo describe el camino feliz de un cliente nuevo que llega, se registra, agrega productos y completa la compra.

```mermaid
sequenceDiagram
    actor C as Cliente
    participant FE as Frontend
    participant DB as Base de Datos

    C->>FE: Ingresa al Sitio
    FE->>C: Muestra Catálogo (Público)
    C->>FE: Selecciona Producto -> "Agregar al Carrito"
    alt No Autenticado
        FE->>C: Solicita Login o Registro
        C->>FE: Completa Formulario Registro
        FE->>DB: Crea Usuario
        DB-->>FE: Usuario Creado OK
    end
    FE->>DB: Verifica y Reserva Stock Temporal
    FE->>C: Muestra Carrito actualizado
    C->>FE: Click en "Finalizar Compra" (Checkout)
    C->>FE: Elije Envío (Domicilio $4000 / Retiro $0)
    opt Envío a Domicilio
        C->>FE: Ingresa Dirección
    end
    C->>FE: Confirma Pedido
    FE->>DB: Guarda Pedido "PENDIENTE"
    DB-->>FE: Pedido Guardado
    FE->>C: Muestra Página "Gracias" con Datos de Transferencia
    Note right of C: El cliente debe transferir manualmente
```

## Flujo 2: Verificación y Despacho (Administrador)
Flujo donde el administrador revisa un pago y procesa el pedido.

```mermaid
graph TD
    A[Inicio: Cliente avisa transferencia<br>o Admin revisa Banco] --> B(Admin entra al Backoffice);
    B --> C{Busca Pedido Pendiente};
    C -->|No encuentra pago| D[Mantiene estado Pendiente];
    C -->|Pago Recibido| E[Marca Pedido como PAGADO];
    E --> F{Tipo de Envío?};
    F -->|Retiro| G[Aparta producto en mostrador];
    F -->|Domicilio| H[Prepara Paquete para envío];
    G --> I[Cambia estado a ENTREGADO<br>cuando cliente retira];
    H --> J[Cambia estado a ENVIADO];
    J --> I2[Cambia estado a ENTREGADO<br>cuando correo confirma];
```
