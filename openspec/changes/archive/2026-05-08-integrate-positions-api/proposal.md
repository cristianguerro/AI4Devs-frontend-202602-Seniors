## Why

The Positions list screen currently renders mock data hardcoded in the component. To deliver a production-ready recruiter dashboard, the list must fetch real position data from the backend API and remain synchronized with server state. E2E tests must validate the complete data flow from backend to UI.

## What Changes

- Replace `mockPositions` constant with dynamic data fetching from backend API
- Add a positions service that calls `GET /positions` endpoint
- Implement loading states, error handling, and retry logic
- Add E2E tests validating the full flow: backend response → component render → user interactions
- Ensure positions display matches backend data structure without transformation

## Capabilities

### New Capabilities

- `positions-list-api`: Wire the positions list screen to the backend positions API, including loading/error states, and validate E2E with automated tests.

### Modified Capabilities

<!-- None: no existing spec requirements are changing -->

## Impact

- **Frontend Components**: `Positions.tsx` component refactored to use API instead of mock data
- **Frontend Services**: New `positionsService.ts` for backend communication
- **API Integration**: Depends on backend `GET /positions` endpoint
- **Testing**: E2E tests added to validate backend-to-UI data flow using Playwright
- **No Breaking Changes**: Existing position card layout and interaction remain unchanged
