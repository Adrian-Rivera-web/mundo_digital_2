# Plan de Estudio del Código: Mundo Digital 2

Este documento sirve como guía para entender la arquitectura, tecnologías y pruebas unitarias del proyecto.

## 1. Stack Tecnológico Principal

Antes de profundizar en el código, es importante entender las herramientas base:

*   **Core**: React 19 (UI Library), TypeScript (Tipado estático).
*   **Build Tool**: Vite (Empaquetador rápido y servidor de desarrollo).
*   **Estilos**: Tailwind CSS (Utility-first CSS), `clsx` y `tailwind-merge` (Manejo condicional de clases).
*   **Estado Global**: Zustand (Gestor de estado ligero).
*   **Enrutamiento**: React Router DOM 7.
*   **Formularios**: React Hook Form + Zod (Validación).
*   **Testing**: Vitest (Runner de pruebas) + React Testing Library.

## 2. Estructura del Proyecto (Orden de Estudio Sugerido)

Recomiendo estudiar el código en el siguiente orden para construir el conocimiento capa por capa:

### Nivel 1: UI y Componentes Base
Explora `src/components`. Aquí están los bloques de construcción visuales.
*   Busca componentes "atomicos" (botones, inputs).
*   Observa cómo usan `className` con clases de Tailwind.
*   Entiende cómo reciben `props` tipadas con TypeScript.

### Nivel 2: Páginas y Rutas
Explora `src/pages` y `src/App.tsx` / `main.tsx`.
*   **`src/pages`**: Son los componentes que representan vistas completas (ej. Login, Home).
*   **`App.tsx`**: Define las rutas principales. Fíjate en cómo `react-router-dom` maneja la navegación entre estas páginas.

### Nivel 3: Lógica de Negocio y Estado
*   **`src/services`**: Aquí viven las llamadas a APIs externas o simuladas. Observa cómo funciones asíncronas (`async/await`) manejan datos.
*   **`src/context`** (usando `AuthContext.tsx`): Entiende cómo React Context o Zustand manejan datos globales como el usuario autenticado.
*   **`src/hooks`**: Hooks personalizados para reutilizar lógica (ej. lógica de formularios o fetch de datos).

---

## 3. Pruebas Unitarias (Testing)

El archivo clave para empezar es `src/tests/unit.spec.tsx`.

### Configuración
El proyecto usa **Vitest**. La configuración está en `vitest.config.ts`. Es compatible con la sintaxis de Jest.
*   Usa `jsdom` para simular un navegador en Node.js.

### Anatomía de una Prueba (`unit.spec.tsx`)

Abre el archivo y verás esta estructura básica:

```typescript
import { describe, it, expect } from 'vitest';
// Otros imports (componentes, testing-library)...

describe('Nombre del Grupo de Pruebas', () => {

  it('debería hacer algo específico (ej. renderizar correctamente)', () => {
    // 1. Arrange (Preparar): Renderizar componente o inicializar variables.
    render(<MiComponente />);

    // 2. Act (Actuar): Simular eventos (clicks, escritura) si es necesario.
    
    // 3. Assert (Verificar): Comprobar que el resultado es el esperado.
    expect(screen.getByText('Hola Mundo')).toBeInTheDocument();
  });

});
```

*   **`describe`**: Agrupa pruebas relacionadas.
*   **`it` / `test`**: Define un caso de prueba individual.
*   **`expect`**: La aserción. Si esto falla, la prueba falla.
*   **`render`**: De `@testing-library/react`, renderiza el componente virtualmente.
*   **`screen`**: Accede al DOM virtual para buscar elementos.

### Cómo Ejecutar las Pruebas

Abre tu terminal y ejecuta:

```bash
npm run test
```
o
```bash
npm test
```

Esto ejecutará `vitest run`, buscará archivos terminados en `.spec.tsx` o `.test.tsx` y mostrará los resultados (Pass/Fail).

## 4. Ejercicio Práctico Sugerido

1.  **Lectura**: Lee `src/services/auth.service.ts` para ver cómo se simula el login.
2.  **Rastreo**: Ve a `src/pages/auth/LoginPage.tsx` (o similar) y sigue el flujo: ¿Qué pasa cuando el usuario hace click en "Entrar"?
3.  **Testing**: Intenta romper una prueba en `src/tests/unit.spec.tsx` cambiando una expectativa (ej. cambia un texto esperado) y corre `npm test` para verla fallar. Luego arréglala.

## 5. Glosario Rápido
*   **Mock**: Una simulación de una función o servicio real para aislar lo que estamos probando.
*   **Snapshot**: Una "foto" de la estructura HTML del componente para detectar cambios inesperados.
