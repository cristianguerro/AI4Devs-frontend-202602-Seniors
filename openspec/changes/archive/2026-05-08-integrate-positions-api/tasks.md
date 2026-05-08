## 1. Service Layer Setup

- [x] 1.1 Create `frontend/src/services/positionsService.ts` with TypeScript types for Position and API response
- [x] 1.2 Implement `getPositions()` method that calls `GET /positions` endpoint with fallback URL paths
- [x] 1.3 Add error handling in service to catch network failures and provide clear error messages
- [x] 1.4 Configure API base URL from environment variable `REACT_APP_API_URL` with fallback to `http://localhost:3010`

## 2. Component State and Data Fetching

- [x] 2.1 Add state variables to `Positions.tsx` for `loading`, `error`, and `positions` data
- [x] 2.2 Implement `useEffect` hook to fetch positions from service on component mount
- [x] 2.3 Update component state with fetched positions on success
- [x] 2.4 Set error message in state if fetch fails
- [x] 2.5 Ensure loading flag is set to false after fetch completes (success or failure)

## 3. UI for Loading and Error States

- [x] 3.1 Add loading spinner that displays while `loading === true`
- [x] 3.2 Hide positions grid while loading is in progress
- [x] 3.3 Add error alert component that displays when `error` is set
- [x] 3.4 Keep positions grid visible even when error is displayed (allow retry via refresh)
- [x] 3.5 Clear error message when component remounts or user dismisses alert

## 4. Data Display and Rendering

- [x] 4.1 Replace `mockPositions` constant with the fetched `positions` state
- [x] 4.2 Render positions grid using fetched data
- [x] 4.3 Verify each position card displays: title, manager, deadline, status fields correctly
- [x] 4.4 Handle empty positions list gracefully (show "No positions available" message)
- [x] 4.5 Ensure position.id is included in fetched data for routing to detail pages

## 5. Integration Testing

- [x] 5.1 Add unit test for Positions component rendering with mock positions data
- [x] 5.2 Add unit test for loading state display
- [x] 5.3 Add unit test for error state display
- [x] 5.4 Add unit test verifying `getPositions` service is called on mount
- [x] 5.5 Test that positions grid is hidden while loading

## 6. E2E Testing with Playwright

- [x] 6.1 Add Playwright E2E test that mocks backend `/positions` endpoint
- [x] 6.2 E2E test verifies positions appear in the grid after loading completes
- [x] 6.3 E2E test verifies each position displays correct title, manager, deadline, status
- [x] 6.4 E2E test clicks "Ver proceso" button and verifies navigation to process detail page
- [x] 6.5 E2E test simulates API error and verifies error alert is displayed
- [x] 6.6 E2E test verifies responsive behavior on mobile viewport

## 7. Validation and Cleanup

- [x] 7.1 Run unit tests locally and verify all pass
- [x] 7.2 Run E2E tests with Playwright MCP and verify all pass
- [x] 7.3 Build frontend for production and verify no ESLint errors
- [x] 7.4 Test manually in browser: backend positions load, errors display correctly, navigation works
- [x] 7.5 Verify search/filter inputs remain non-functional (as designed for this iteration)
- [x] 7.6 Mark all tasks complete in `tasks.md`
