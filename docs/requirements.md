# Documento de Definición de Requerimientos (Discovery)

**Fecha:** 2026-01-20
**Versión:** 1.0
**Estado:** Aprobado para MVP

---

## 1. Resumen Ejecutivo y Restricciones
Este documento consolida las decisiones tomadas durante la fase de Discovery para el desarrollo del e-commerce "Mundo Digital".

### 🔴 Restricciones Críticas (Hard Constraints)
1.  **Fecha Límite (Deadline):** 1 Semana.
    *   *Consecuencia:* Todo desarrollo no esencial se mueve a Fase 2.
2.  **Presupuesto/Recursos:** Equipo limitado (Yo como Agente + Tu supervisión).
3.  **Tecnología:** Stack existente (React/Vite + TypeScript).

### 🎯 Objetivo del MVP
Lanzar una tienda funcional que permita la venta de electrónicos (~50 productos) con un flujo de compra completo pero manual en su gestión financiera, enfocado en un nicho "Gamer" en Santiago.

---

## 2. Alcance Funcional (Scope)

### 2.1 In-Scope (Lo que SÍ haremos)
*   **Catálogo:**
    *   ~50 Productos iniciales (Carga manual o script simple).
    *   Categorías básicas (Laptops, Periféricos, Componentes).
    *   Buscador y Filtros básicos (ya existentes).
    *   **Imágenes:** Uso de placeholders si no hay fotos reales disponibles.
*   **UX/UI:**
    *   Estética Gamer (Dark Mode toggle).
    *   Home con Banners de oferta y sección "Más Vendidos".
*   **Venta:**
    *   **Modelo:** B2C.
    *   **Registro:** Obligatorio (RUT, Teléfono, Dirección). NO hay Guest Checkout.
*   **Checkout y Pagos:**
    *   **Medio de Pago:** Transferencia Bancaria Manual.
    *   **Flujo:** Checkout -> Instrucciones de Transferencia -> Confirmación ("Mostrar Comprobante/Boleta no fiscal").
*   **Logística:**
    *   Cobertura: **Solo Santiago**.
    *   Métodos: Retiro en Tienda (Gratis) y Envío Fijo (Domicilio).
*   **Post-Venta:**
    *   Vista "Mis Pedidos" para el usuario (Estados: Pendiente, Enviado, Entregado).
    *   Gestión de pedidos vía Panel de Administración (existente o mejora básica).

### 2.2 Out-of-Scope (Lo que NO haremos en Fase 1)
*   ❌ Pasarelas de Pago automáticas (Webpay/MercadoPago).
*   ❌ Emails transaccionales automáticos (SMTP/SendGrid).
*   ❌ Integración con SII (Boleta Electrónica Fiscal).
*   ❌ Carro de compras persistente (si no está ya hecho).
*   ❌ App Móvil.
*   ❌ Sistema complejo de devoluciones en web.

---

## 3. Definiciones Operativas

### 3.1 Gestión de Usuarios
*   Se deben capturar y validar: **RUT** y **Teléfono** en el registro.
*   Estos datos son mandatorios para la "boleta" interna.

### 3.2 Administración (Backoffice)
*   El cliente (Tú) gestionará:
    *   **Stock:** Manualmente desde el panel/BD.
    *   **Estados de Pedido:** Actualización manual tras verificar transferencias en el banco.

### 3.3 Legal
*   **Comprobante:** El sistema emitirá un "Resumen de Pedido". La boleta fiscal real se emitirá manualmente por fuera del sistema.
*   **Términos y Condiciones:** Página estática "En Construcción" o texto genérico.

---

## 4. Próximos Pasos Técnicos
1.  **Análisis de Brechas (Gap Analysis):** Revisar código actual vs. Requerimientos.
    *   Verificar existencia de campos RUT/Teléfono en BD y Frontend.
    *   Verificar estado del Panel de Administración.
    *   Implementar/Verificar Toggle Dark Mode.
2.  **Implementation Plan:** Definir tareas de código.
