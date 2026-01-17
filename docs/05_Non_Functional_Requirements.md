# 05. Requerimientos No Funcionales

## 1. Eficiencia y Rendimiento (Performance)
- **RNF-001 Tiempos de Carga**: El tiempo de carga inicial de la página principal no debe exceder los 2 segundos en conexiones 4G estándar.
- **RNF-002 Concurrencia**: El sistema debe soportar al menos 50 usuarios concurrentes navegando y realizando operaciones básicas sin degradación del servicio (para la fase inicial).

## 2. Seguridad
- **RNF-003 Comunicación Segura**: Todo el tráfico debe viajar encriptado bajo protocolo HTTPS.
- **RNF-004 Almacenamiento de Contraseñas**: Las contraseñas de los usuarios deben almacenarse hasheadas (ej. bcrypt), nunca en texto plano.
- **RNF-005 Sanitización de Inputs**: Protección contra inyecciones SQL y XSS en todos los formularios y parámetros de URL.

## 3. Usabilidad y UX
- **RNF-006 Diseño Responsivo**: La interfaz debe adaptarse fluidamente a dispositivos móviles (celulares), tablets y desktops.
- **RNF-007 Feedback al Usuario**: Cada acción crítica (agregar al carrito, finalizar compra, error de login) debe mostrar una notificación visual clara al usuario.

## 4. Disponibilidad y Confiabilidad
- **RNF-008 Horario de Operación**: El sistema (Storefront) estará disponible 24/7.
- **RNF-009 Backup**: Se debe contar con una estrategia de respaldo de base de datos diaria.

## 5. Implementación Tecnológica (Sugerida)
- Frontend: React / Next.js / Vite
- Backend: Node.js / Python / C#
- Base de Datos: Relacional (PostgreSQL / MySQL / SQL Server)
