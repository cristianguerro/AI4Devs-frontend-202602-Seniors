# Prompts utilizados - Módulo 10 Frontend

## Prompt 1 - Análisis inicial del proyecto

```text
Actúa como desarrollador frontend senior experto en React, TypeScript y UI engineering.

Lee el archivo AGENTS.md antes de responder.

Contexto:
Este proyecto pertenece al ejercicio del módulo 10 AI4Devs frontend.

Necesito implementar una nueva vista tipo kanban para visualizar candidatos por fase de entrevista dentro de una posición.

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

---

## Prompt 2 - Implementación de la pantalla Kanban

```text
Implementa la vista de detalle de posición siguiendo el plan aprobado.

Lee AGENTS.md antes de modificar código.

Objetivo:
Crear una página /positions/:positionId tipo kanban para gestionar candidatos por fase de entrevista.

Implementación requerida:

1. Crear frontend/src/services/positionService.ts con:
   - getInterviewFlowByPosition(positionId)
   - getCandidatesByPosition(positionId)
   - updateCandidateStage(candidateId, applicationId, currentInterviewStep)

2. Crear frontend/src/components/PositionDetail.tsx

3. Crear componentes:
   - KanbanBoard.tsx
   - KanbanColumn.tsx
   - CandidateCard.tsx

4. Implementar drag and drop nativo HTML5.

5. Añadir responsive mobile.

Restricciones:
- No instales dependencias nuevas.
- No modifiques backend.
- No hagas refactor global.
```

---

## Prompt 3 - Ajuste de datos seed para validar el kanban

```text
Necesito validar correctamente la interfaz kanban del ejercicio.

Problema actual:
La página /positions/1 solo muestra una columna porque el backend devuelve un único interviewStep.

Objetivo:
Modificar únicamente backend/prisma/seed.ts para que la posición 1 tenga:
- Screening
- Technical Interview
- Cultural Interview
- Manager Interview

Y candidatos repartidos entre esas fases.

Restricciones:
- No modificar schema.prisma.
- No modificar endpoints.
- No modificar frontend.
- Mantener el cambio pequeño y localizado.
```

---

## Flujo seguido

1. Análisis inicial del proyecto mediante IA.
2. Definición de arquitectura mínima y enfoque sin sobreingeniería.
3. Implementación incremental de la pantalla kanban.
4. Validación visual y funcional.
5. Ajuste controlado de datos seed para validar múltiples columnas y drag & drop.
6. Validación final manual en navegador.