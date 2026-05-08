## ADDED Requirements

### Requirement: Fetch positions from backend API

The Positions list component SHALL fetch position data from the backend `GET /positions` endpoint on component mount and display the list.

#### Scenario: Positions loaded successfully

- **WHEN** the Positions component is mounted
- **THEN** the component calls `GET /positions` endpoint
- **AND** positions data is fetched and displayed in the grid

#### Scenario: Positions list renders with correct fields

- **WHEN** positions data is loaded from the backend
- **THEN** each position card displays: title, manager, deadline, and status
- **AND** the "Ver proceso" link is present for each position

### Requirement: Loading state during data fetch

The component SHALL display a loading indicator while fetching positions data.

#### Scenario: Loading spinner appears during fetch

- **WHEN** the component is mounting and fetching starts
- **THEN** a loading spinner is displayed to the user
- **AND** the positions grid is hidden until data arrives

#### Scenario: Loading state clears after fetch completes

- **WHEN** positions data arrives from the backend
- **THEN** the loading spinner disappears
- **AND** positions grid is rendered with data

### Requirement: Error handling and user feedback

The component SHALL display a clear error message if the API request fails and allow the user to retry.

#### Scenario: API request fails

- **WHEN** the `GET /positions` request fails (network error, server error, timeout)
- **THEN** an error alert is displayed with a message explaining what went wrong
- **AND** the positions grid remains visible (not hidden)

#### Scenario: User can retry after error

- **WHEN** an error is displayed
- **THEN** the user can refresh the page or interact with the component to trigger a retry
- **AND** a new fetch attempt is made

### Requirement: Response data matches component schema

The component SHALL accept position data from the backend and display it without type errors or transformation failures.

#### Scenario: Backend position schema is compatible

- **WHEN** the backend returns position objects with fields: id, title, manager, deadline, status
- **THEN** the component displays each field correctly without errors
- **AND** no data transformation or mapping is required beyond type casting

#### Scenario: Empty positions list is handled gracefully

- **WHEN** the backend returns an empty positions array
- **THEN** the grid renders without positions
- **AND** no error is displayed (empty state is valid)

### Requirement: Automated E2E validation of backend-to-UI data flow

The implementation SHALL include E2E tests that validate the complete flow from backend response through component rendering and user interactions.

#### Scenario: E2E test validates positions render from API data

- **WHEN** an E2E test runs with a mocked backend response
- **THEN** the test asserts that positions appear in the DOM
- **AND** each position displays the correct title, manager, deadline, and status

#### Scenario: E2E test validates navigation via position action

- **WHEN** an E2E test clicks the "Ver proceso" button on a position card
- **THEN** the test asserts that the user navigates to `/positions/<id>/process`
- **AND** the position detail page loads for the selected position

#### Scenario: E2E test validates error handling

- **WHEN** an E2E test simulates a failed API response
- **THEN** the test asserts that an error alert is displayed
- **AND** the error message is visible to the user

### Requirement: Integration with existing backend API

The component SHALL use the backend positions endpoint with proper configuration for API base URL and error handling.

#### Scenario: API base URL is configurable

- **WHEN** the component runs in different environments
- **THEN** the API base URL is read from environment variable `REACT_APP_API_URL`
- **AND** defaults to `http://localhost:3010` if not set

#### Scenario: API request includes proper headers

- **WHEN** a positions fetch request is made
- **THEN** the request includes `Content-Type: application/json` header
- **AND** the request is sent with GET method to `/positions`

#### Scenario: API errors are handled with clear messages

- **WHEN** the backend returns a 5xx or 4xx error
- **THEN** the component displays a user-friendly error message
- **AND** technical error details are logged (not shown to user)
