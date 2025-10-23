# Action Agenda Youth (VoluntariaJoven)

Proyecto frontend construido con Vite + React + TypeScript y Tailwind CSS.

## Ejecutar localmente

Prerequisitos:
- Node.js (16+ recomendado, preferible LTS 18/20).
- npm (incluido con Node.js).

Pasos:

```powershell
cd C:\Users\Lilibeth\Desktop\voluntariado_app\action-agenda-youth
npm install
# Action Agenda Youth (VoluntariaJoven)

Este repositorio contiene la aplicación frontend construida con Vite, React y TypeScript, y estilizada con Tailwind CSS. Está preparada como base para una interfaz de usuario moderna que usa primitives accesibles (Radix) y utilidades para formularios, validación y cacheo de datos.

---

## Resumen

- Framework: React 18
- Bundle / Dev server: Vite
# VoluntariaJoven — Plataforma de Voluntariado Juvenil

Una SPA frontend construida con Vite + React + TypeScript y estilo con Tailwind CSS. Esta guía rápida explica la estructura del proyecto, cómo ejecutar y notas útiles para desarrolladores.

---

## Resumen técnico
- Stack: React 18, TypeScript, Vite
- Estilos: Tailwind CSS
- Enrutamiento: react-router-dom
- Fetching/cache: @tanstack/react-query
- Formularios y validación: react-hook-form + zod

---

## Estructura del proyecto (resumen)

- `index.html` — HTML de entrada que monta la app.
- `package.json` — scripts y dependencias.
- `vite.config.ts` — configuración de Vite (alias `@`, puerto, plugins).
- `src/` — código fuente:
	- `main.tsx` — punto de entrada que monta React y Providers.
	- `App.tsx` — enrutador y layout global.
	- `pages/` — vistas y rutas (Index, Login, Register, Proyectos, MisHoras, etc.).
	- `components/` — componentes reutilizables y UI primitives.
		- `ui/` — wrappers y primitives (algunos stubs para mantener compatibilidad tras limpieza).
	- `hooks/` — hooks personalizados (ej. `useGlobalShortcuts`).
	- `i18n/` — contexto y traducciones.
	- `lib/` — utilidades y helpers.
	- `assets/` — imágenes y recursos importables.
---

## Comandos principales (PowerShell)

Instalar dependencias (recomendado usar `npm ci` en CI):

```powershell
cd C:\Users\Lilibeth\Desktop\voluntariado_app\action-agenda-youth
npm ci
```

Arrancar servidor de desarrollo (Vite):

```powershell
npm run dev
```

Construir para producción y previsualizar:

```powershell
npm run build
npm run preview
```

Lint / typecheck (si están definidos en package.json):

```powershell
npm run lint
npm run typecheck
```

---