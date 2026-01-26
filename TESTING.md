# Guía de Pruebas Unitarias

Esta guía te explica cómo ejecutar las pruebas unitarias del proyecto para demostrarlas a tu profesor.

## Requisitos Previos
Asegúrate de estar en la carpeta del proyecto en tu terminal.

## Comando Principal
Para ejecutar todas las pruebas una sola vez (y ver los 10 "checks" verdes), escribe este comando en tu terminal:

```bash
npm test
```

Verás una salida similar a esta:
```
 ✓ src/tests/unit.spec.tsx (10 tests)
   ✓ Mundo Digital Unit Tests (10)
     ✓ PriceFormatter...
     ✓ Cart...
     ...
 Tests  10 passed (10)
```

## Modo Interactivo (Opcional)
Si quieres que las pruebas se queden corriendo y se actualicen mientras modificas código, usa:

```bash
npx vitest
```
(Para salir de este modo, presiona `q`).
