# Prompts utilizados — Módulo 10 Frontend

Este documento traza el flujo AI-first / SDD ligero seguido durante la implementación de la pantalla `/positions/:positionId` (kanban de candidatos por fase de entrevista) en este ejercicio.

No se usó Spec Kit completo. Se siguió un workflow **SDD ligero / AI-first** apoyado en:

- `AGENTS.md` con reglas del repositorio que el agente lee antes de cada turno.
- Carpeta `prompts/` para registrar los prompts ejecutados.
- Mini-spec en `docs/position-kanban-spec.md` (alcance, FR, decisiones técnicas, validación).
- Iteración pequeña y trazable: cada cambio termina con validación (`npm run build`, `npm test`).

Cada entrada documenta: **Date · Goal · Prompt · Output summary · Files impacted · Validation**.

---

## 1. Initial AI-first setup

### Date
2026-05-09

### Goal
Establecer la base del workflow antes de tocar código de aplicación:

- Definir reglas del proyecto que el agente respete en cada turno (`AGENTS.md`).
- Crear la estructura `prompts/` para trazar prompts ejecutados.
- Sentar las restricciones que también funcionan como reglas operativas de Cursor: no inventar APIs, no sobreingeniería, mobile responsive, mantener arquitectura existente, no instalar dependencias innecesarias.

### Prompt
Prompt usado para inicializar el workflow (intención registrada):

```text
Crear AGENTS.md con contexto, restricciones técnicas, requisitos de UI y reglas de
implementación del módulo 10 (kanban en frontend, sin tocar backend, sin nuevas
dependencias, mobile responsive). Crear la carpeta prompts/ y un primer
prompts-iniciales.md. El objetivo es que estas reglas funcionen también como reglas
operativas de Cursor: el agente debe leer AGENTS.md antes de cada cambio.
```

### Output summary
- `AGENTS.md` con contexto del módulo, restricciones técnicas, UI requirements y reglas de implementación (analizar antes de modificar, no inventar APIs, reutilizar endpoints, preferir componentes pequeños).
- Carpeta `prompts/` con `prompts-iniciales.md` (esqueleto inicial).
- Convención: cada prompt posterior empieza recordando "Lee AGENTS.md antes de modificar código".

### Files impacted
- `AGENTS.md`
- `AI4Devs-frontend-202602-Seniors/prompts/prompts-iniciales.md`

### Validation
- Revisión manual de `AGENTS.md`.
- Confirmación en cada turno posterior de que el agente respeta las restricciones declaradas.

---

## 2. Repository analysis before implementation

### Date
2026-05-09 · 08:16 (UTC+2)

### Goal
Antes de escribir código, entender:

- Estructura del frontend y patrón de routing actual.
- Qué endpoints expone el backend para *interview flow*, *candidates by position* y *update candidate stage*.
- Qué archivos hay que crear o modificar.
- Una propuesta de implementación simple, profesional y alineada con el ejercicio.

### Prompt
```text
Actúa como desarrollador frontend senior experto en React, TypeScript y UI engineering.

Lee el archivo AGENTS.md antes de responder.

Necesito implementar una nueva vista tipo kanban para visualizar candidatos por fase
de entrevista dentro de una posición.

Antes de modificar código:
1. Analiza la estructura actual del frontend.
2. Identifica cómo funciona la navegación actual.
3. Explica cómo añadir una nueva pantalla de detalle de posición.
4. Analiza los servicios/API ya existentes.
5. Identifica si ya existe soporte para obtener:
   - interview flow
   - candidates by position
   - update candidate stage
6. Indica qué archivos habría que crear o modificar.
7. Propón una implementación simple, profesional y alineada con este ejercicio.

Restricciones:
- No modifiques código todavía.
- No instales dependencias todavía.
- No inventes endpoints.
- Evita sobreingeniería.
- Mantén el diseño limpio y responsive.
```

### Output summary
- Routing detectado en `App.js` con `react-router-dom` v6 y rutas `/`, `/add-candidate`, `/positions`.
- Endpoints reales identificados en backend:
  - `GET /position/:id/interviewflow` (devuelve `data.interviewFlow.positionName` y `data.interviewFlow.interviewFlow.interviewSteps` — doble anidación).
  - `GET /position/:id/candidates` (devuelve `currentInterviewStep` como **nombre**, no como id).
  - `PUT /candidates/:id` (body `{ applicationId, currentInterviewStep }` con id numérico).
- Servicio existente `candidateService.js` cubre solo alta/upload de candidatos. Hay que añadir `positionService`.
- Detectado que `axios` está importado por `candidateService.js` pero **no figura en `package.json`** del frontend → el nuevo servicio debe usar `fetch` para no introducir dependencias.
- Plan: añadir ruta `/positions/:positionId`, crear `PositionDetail`, `KanbanBoard`, `KanbanColumn`, `CandidateCard` y `positionService.ts`. Drag & drop nativo HTML5.

### Files impacted
- Ninguno (solo análisis; código no modificado).

### Validation
- Revisión manual del análisis.
- Aprobación del plan antes de pasar a implementación.

---

## 3. Kanban implementation

### Date
2026-05-09 · 08:20 (UTC+2)

### Goal
Implementar `/positions/:positionId` con kanban funcional:

- Servicios API contra los endpoints reales.
- Componentes pequeños y reutilizables.
- Drag & drop nativo HTML5.
- Layout responsive.
- Actualización optimista con rollback ante error.

### Prompt
```text
Implementa la vista de detalle de posición siguiendo el plan aprobado.

Lee AGENTS.md antes de modificar código.

Implementación requerida:

1. frontend/src/services/positionService.ts con:
   - getInterviewFlowByPosition(positionId)
   - getCandidatesByPosition(positionId)
   - updateCandidateStage(candidateId, applicationId, currentInterviewStep)

2. frontend/src/components/PositionDetail.tsx
   - useParams + carga en paralelo
   - loading, error, botón volver, título de posición

3. Componentes kanban:
   - KanbanBoard, KanbanColumn, CandidateCard, kanban.css

4. Drag and drop nativo HTML5 con actualización optimista y rollback.

5. App.js: añadir ruta /positions/:positionId.

6. Positions.tsx: convertir "Ver proceso" en Link con id.

7. Responsive móvil (columnas apiladas verticalmente).

Restricciones:
- No instalar dependencias.
- No modificar backend.
- No convertir App.js a TypeScript.
- Mantener cambio pequeño y enfocado.

Al finalizar:
- Ejecutar npm run build.
- Indicar archivos modificados, errores y warnings.
```

### Output summary
- `positionService.ts` con `fetch` (sin axios) y tipos `InterviewStep`, `InterviewFlowResponse`, `CandidateByPosition`. Maneja la doble anidación devolviendo `data.interviewFlow`.
- `PositionDetail.tsx`: `useParams`, `Promise.all` para flow + candidatos, estados `loading` / `loadError` / `actionError`, botón volver con icono `ArrowLeft` y `<h2>` con el `positionName`.
- `KanbanBoard.tsx`: ordena steps por `orderIndex`, agrupa candidatos por **nombre** del step, drag & drop nativo, actualización optimista + `PUT` con `step.id` y rollback en `catch`.
- `KanbanColumn.tsx`: `<Card>` con header (nombre del step + `Badge` con conteo), drop target con feedback visual `is-drag-over`.
- `CandidateCard.tsx`: tarjeta `draggable` con nombre y rating de estrellas accesible.
- `kanban.css`: scroll horizontal en desktop, stack vertical a `≤768px`.
- Ruta `/positions/:positionId` registrada en `App.js`.
- `Positions.tsx`: añadido `id` al tipo y mocks; "Ver proceso" pasa a `Link to="/positions/${id}"`.

### Files impacted
- Creados:
  - `frontend/src/services/positionService.ts`
  - `frontend/src/components/PositionDetail.tsx`
  - `frontend/src/components/kanban/KanbanBoard.tsx`
  - `frontend/src/components/kanban/KanbanColumn.tsx`
  - `frontend/src/components/kanban/CandidateCard.tsx`
  - `frontend/src/components/kanban/kanban.css`
- Modificados:
  - `frontend/src/App.js` (nueva ruta `/positions/:positionId`)
  - `frontend/src/components/Positions.tsx` (id en mocks + `Link` en "Ver proceso")

### Validation
- `npm run build` → exit 0. Compiled with warnings (1).
- Único warning, **preexistente y ajeno**: `src/components/AddCandidateForm.js:2:31 'InputGroup' is defined but never used`.
- Bundle: ~147.55 kB JS gzip, ~35.14 kB CSS gzip.
- Lints en archivos creados/modificados: 0 errores.

---

## 4. Seed data adjustment

### Date
2026-05-09 · 08:34 (UTC+2)

### Goal
Permitir validar la UI con cuatro columnas y candidatos repartidos. El backend devolvía solo `Screening` para `position 1`, lo que impedía probar drag & drop entre fases.

### Prompt (análisis previo)
```text
Revisa el backend, especialmente Prisma, seed y datos iniciales, para entender cómo
se crean positions, interviewFlows, interviewSteps y applications.

Objetivo:
Proponer el cambio mínimo en datos de seed para que la posición 1 tenga cuatro fases
(Screening, Technical Interview, Cultural Interview, Manager Interview) y candidatos
repartidos, sin cambiar lógica de backend ni endpoints.

Restricciones:
- No modificar código todavía.
- No tocar schema, migraciones, endpoints, servicios ni frontend.
- Indicar qué archivos tocar y qué comando ejecutar después.
```

### Prompt (aplicación)
```text
Aplica el cambio mínimo en backend/prisma/seed.ts para que la posición 1 tenga datos
suficientes para validar la interfaz kanban.

Cambios permitidos:
- Renombrar Initial Screening a Screening.
- Corregir orderIndex (1, 2, 3, 4).
- Añadir el step Cultural Interview.
- Añadir un candidato adicional si es necesario.
- Añadir una application adicional para Manager Interview.
- Repartir las applications de position1 entre las fases.
- Añadir scores/interviews si ayuda a visualizar averageScore.

Restricciones:
- No modificar schema.prisma, migraciones, endpoints, servicios ni frontend.
- No instalar dependencias.

Después de modificar, no ejecutes comandos destructivos automáticamente.
Indícame exactamente qué comandos debo ejecutar para resetear y sembrar la base
de datos.
```

### Output summary
- En `backend/prisma/seed.ts`:
  - `Initial Screening` → `Screening`.
  - Corregido `orderIndex` duplicado: `1` Screening, `2` Technical Interview, `3` Cultural Interview (nuevo), `4` Manager Interview.
  - Nuevo `candidate4` (Lucia Perez) con education/work/resume.
  - Nuevo `application5` para `position1` con `currentInterviewStep = interviewStep4.id` (Manager).
  - Repartidos los `currentInterviewStep` de `application1/3/4/5` para que cada una de las cuatro fases tenga al menos un candidato.
  - Añadidas dos `Interview` extra (con `score`) para que `averageScore` se visualice mejor.
- No se modificó `schema.prisma`, migraciones, controladores, servicios ni endpoints.
- Comandos a ejecutar manualmente:

  ```sh
  cd backend
  npx prisma migrate reset --force
  npx ts-node prisma/seed.ts
  ```

### Files impacted
- `backend/prisma/seed.ts`

### Validation
- Lints en `seed.ts`: 0 errores.
- No se ejecutaron comandos destructivos automáticamente; se delegó al desarrollador.
- Validación visual posterior: la posición 1 muestra cuatro columnas con candidatos repartidos.

---

## 5. Duplicate App entry point fix

### Date
2026-05-09 · 08:42 (UTC+2)

### Goal
La home `/` aparecía vacía en el navegador pese a que el build compilaba sin errores. Identificar la causa raíz y aplicar el cambio mínimo.

### Prompt
```text
La aplicación compila correctamente, pero al abrir http://localhost:3000/ la pantalla
aparece vacía.

Analiza:
1. frontend/src/App.js
2. frontend/src/components/RecruiterDashboard.js
3. Las rutas de react-router-dom
4. Imports/export posibles rotos
5. Errores que puedan producir render vacío en "/"

Identifica exactamente por qué "/" no renderiza.
Aplica el cambio mínimo necesario.
No tocar nada relacionado con la pantalla kanban si no es necesario.

Después: explica la causa raíz, indica qué archivo modificaste y ejecuta npm run build.
```

### Output summary
- **Causa raíz**: coexistían `frontend/src/App.tsx` (placeholder por defecto de CRA, sin Router) y `frontend/src/App.js` (la app real con `BrowserRouter` y todas las rutas, incluida `/` → `RecruiterDashboard`). `index.tsx` importa `'./App'` sin extensión, generando ambigüedad de entry point. Aunque el orden de `resolve.extensions` de CRA hace ganar a `.js` en producción, la duplicidad es frágil con HMR del dev server y constituye un foco de bugs.
- Verificación: el bundle de producción contiene `Dashboard del Reclutador` y NO contiene `Edit src/App.tsx`/`Learn React`, confirmando que `App.js` ganaba en build pero el placeholder no aportaba nada.
- **Cambio mínimo**: eliminar `frontend/src/App.tsx`. No se tocó `App.css` ni `logo.svg` (huérfanos inocuos) para mantener el cambio acotado.

### Files impacted
- Eliminado: `frontend/src/App.tsx`.

### Validation
- `npm run build` → exit 0.
- Bundle mantiene `Dashboard del Reclutador` (1 match) y sin referencias a `Edit src/App.tsx` (0 matches).
- Único warning preexistente: `AddCandidateForm.js` `'InputGroup' is defined but never used`.
- Tamaños de bundle idénticos al build anterior, confirmando que sólo se elimina la ambigüedad sin cambiar el contenido bundlado.

---

## 6. Accessibility and testing improvement

### Date
2026-05-09 · 08:58 (UTC+2)

### Goal
Reforzar la entrega antes de push:

- Permitir configurar la base URL del backend por entorno (`REACT_APP_API_URL`).
- Añadir una alternativa accesible al drag & drop dentro de la tarjeta, sin nuevas dependencias y reutilizando la misma lógica.
- Cubrir `PositionDetail` con tests mínimos.
- Confirmar el comportamiento responsive en móvil.

### Prompt
```text
Actúa como frontend senior experto en React, TypeScript, accesibilidad y testing.

Lee AGENTS.md antes de modificar código.

Aplicar mejoras mínimas sin rehacer la solución:

1. positionService.ts: usar REACT_APP_API_URL como base URL si existe; mantener
   http://localhost:3010 como fallback. No inventar endpoints.

2. CandidateCard/Kanban: añadir alternativa accesible para mover candidato sin drag
   & drop (un select pequeño dentro de la tarjeta con las fases disponibles). Debe
   llamar a la misma lógica existente que el drag & drop. Mantener el drag & drop.

3. Tests mínimos:
   - La pantalla de detalle renderiza el título de la posición.
   - Renderiza columnas según interviewSteps.
   - Renderiza candidatos en su columna correspondiente.
   - Permite mover candidato y llama al servicio de actualización.
   - Si la actualización falla, hace rollback o muestra error.

4. Confirmar que en móvil las columnas se apilan verticalmente y ocupan el ancho
   completo.

Restricciones:
- No cambiar rutas, backend ni endpoints.
- No instalar dependencias si no es imprescindible.
- No hacer refactor global.
- No convertir App.js a TypeScript.
- Mantener componentes separados.

Al finalizar:
- Ejecutar CI=true npm test -- --watchAll=false.
- Ejecutar npm run build.
- Indicar errores o warnings.
```

### Output summary
- `positionService.ts`: `API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3010'`. Sin nuevos endpoints.
- Refactor pequeño en `KanbanBoard`: extraída `moveCandidate(applicationId, targetStepId)` con la misma lógica de actualización optimista + rollback. `handleDrop` delega en ella, así que **drag & drop y `<select>` comparten exactamente el mismo flujo**.
- `CandidateCard`: añadido `<select>` con `aria-label="Cambiar fase de ${fullName}"`, opciones por step (`value={step.id}`) y `value={currentStepId}`. Bloquea el drag con `draggable={false}` + `stopPropagation` en `onMouseDown` / `onClick` / `onDragStart`. Llama a `onMoveCandidate`.
- `KanbanColumn`: propaga `steps` y `onMoveCandidate` al card.
- `kanban.css`: añadida `.kanban-card-select` (cursor + tamaño). Sin tocar la sección responsive.
- Responsive confirmado: `@media (max-width: 768px)` apila columnas verticalmente con `flex: 1 1 auto; max-width: 100%`. Sin cambios necesarios.
- `package.json`: el script `test` apuntaba a `jest --config jest.config.js` (archivo inexistente), por lo que `npm test` estaba roto desde el inicio. Corregido a `react-scripts test` (estándar CRA, sin nuevas dependencias).
- Creado `frontend/src/setupTests.ts` con `import '@testing-library/jest-dom';` (matchers).
- Creado `frontend/src/components/PositionDetail.test.tsx` con 5 casos. Mockea `positionService` y monta el componente dentro de `MemoryRouter` + `Routes` con la ruta `/positions/:positionId`. Cubre:
  1. Renderiza el título de la posición.
  2. Renderiza una columna por `interviewStep`.
  3. Renderiza cada candidato en la columna de su fase actual (vía `value` del select).
  4. Cambiar el `<select>` invoca `updateCandidateStage(candidateId, applicationId, targetStepId)` con argumentos correctos.
  5. Si la actualización falla, aparece un alert (`role="alert"`) con el mensaje y el candidato vuelve a su fase original (rollback verificado por el `value` del select).
- Las acciones que disparan estado asíncrono se envuelven en `act(async ...)` para drenar microtasks dentro del test y mantener el output limpio.

### Files impacted
- Modificados:
  - `frontend/src/services/positionService.ts`
  - `frontend/src/components/kanban/KanbanBoard.tsx`
  - `frontend/src/components/kanban/KanbanColumn.tsx`
  - `frontend/src/components/kanban/CandidateCard.tsx`
  - `frontend/src/components/kanban/kanban.css`
  - `frontend/package.json` (sólo el script `test`)
- Creados:
  - `frontend/src/setupTests.ts`
  - `frontend/src/components/PositionDetail.test.tsx`

### Validation
- `CI=true npm test -- --watchAll=false` → exit 0. **5/5 tests pasan**:
  - renderiza el título de la posición
  - renderiza una columna por interviewStep
  - renderiza cada candidato en la columna de su fase actual
  - al cambiar la fase desde el select llama a updateCandidateStage
  - hace rollback y muestra el mensaje de error si la actualización falla
- `npm run build` → exit 0. Bundle: 147.86 kB JS gzip (+305 B), 35.15 kB CSS gzip (+11 B).
- Único warning, **preexistente y ajeno**: `AddCandidateForm.js` `'InputGroup' is defined but never used`.
- Lints en archivos modificados/creados: 0 errores.

---

## 7. Final validation checklist

### Date
2026-05-09 · 09:05 (UTC+2)

### Estado funcional

- [x] `/` renderiza el dashboard del reclutador (RecruiterDashboard).
- [x] `/positions` renderiza el listado de posiciones con botón "Ver proceso".
- [x] `/positions/1` renderiza el kanban con cuatro columnas (Screening, Technical Interview, Cultural Interview, Manager Interview) y candidatos repartidos.
- [x] **Drag & drop** entre columnas funciona y persiste vía `PUT /candidates/:id`.
- [x] **`<select>` accesible** dentro de cada tarjeta funciona y reutiliza la misma lógica que el drag & drop.
- [x] Actualización optimista con rollback + alert cuando el backend rechaza el cambio.
- [x] Responsive: en `≤768px` columnas apiladas verticalmente al ancho completo.
- [x] Botón volver desde `/positions/:id` a `/positions`.

### Estado técnico

- [x] `CI=true npm test -- --watchAll=false` → 5/5 tests pasan, exit 0.
- [x] `npm run build` → exit 0.
- [x] Único warning de build: `AddCandidateForm.js` `'InputGroup' is defined but never used` — preexistente y ajeno a este ejercicio.
- [x] Sin dependencias nuevas.
- [x] Sin cambios en endpoints, controladores, servicios de backend ni `schema.prisma`.
- [x] `App.js` no convertido a TypeScript.
- [x] `App.tsx` placeholder eliminado para evitar ambigüedad de entry point.

### Workflow

Se siguió un **SDD ligero / AI-first workflow** apoyado en:

- `AGENTS.md` con reglas operativas leídas por el agente en cada turno.
- Mini-spec en `docs/position-kanban-spec.md` (alcance, requisitos funcionales, decisiones técnicas, criterios de validación).
- Trazabilidad de prompts en este archivo.
- Iteración pequeña y validada con `npm run build` y `npm test` en cada paso.

No se usó Spec Kit completo. El proceso fue intencionadamente minimalista, alineado con las restricciones del módulo 10: arquitectura existente, sin sobreingeniería, sin nuevas dependencias y con foco en mantenibilidad.
