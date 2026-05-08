## ADDED Requirements

### Requirement: Position process detail route access

The system SHALL provide navigation from the positions list to a position process detail page for the selected position.

#### Scenario: Open process detail from positions list

- **WHEN** the user clicks the "Ver proceso" action for a position card
- **THEN** the application navigates to the position process detail page for that position id

#### Scenario: Return to positions list from detail page

- **WHEN** the user clicks the back button in the position process detail page
- **THEN** the application returns to the positions list screen

### Requirement: Position process page structure

The position process detail page SHALL render a visible title and a Kanban board with one column per stage of the interview flow.

#### Scenario: Render title and stage columns

- **WHEN** the page loads successfully for a position
- **THEN** the page shows a title for the position process and renders one board column for each stage returned by GET /positions/:id/interviewFlow

#### Scenario: Render empty stages

- **WHEN** a stage has no candidates assigned
- **THEN** the stage column is still rendered and available as a drop target

### Requirement: Candidate card content

Each candidate card SHALL display the candidate full name and average score.

#### Scenario: Card shows required fields

- **WHEN** candidate data is loaded from GET /positions/:id/candidates
- **THEN** each rendered candidate card includes full name and average score

#### Scenario: Candidate appears in corresponding stage

- **WHEN** the board is built from flow and candidate data
- **THEN** each candidate card is displayed in the column matching the candidate current stage

### Requirement: Drag and drop stage transition

The system SHALL allow users to move a candidate card between stage columns using drag and drop and MUST persist the new stage through PUT /candidates/:id/stage.

#### Scenario: Successful stage change

- **WHEN** the user drags a candidate card from one stage column and drops it into another valid stage column
- **THEN** the UI updates the candidate card to the target column and the system sends PUT /candidates/:id/stage with the target stage

#### Scenario: Persisted stage remains after refresh

- **WHEN** a stage change request succeeds
- **THEN** a subsequent board reload shows the candidate in the updated stage

#### Scenario: Failed stage change is recoverable

- **WHEN** PUT /candidates/:id/stage fails
- **THEN** the UI informs the user and the candidate card state remains consistent with backend data

### Requirement: Responsive process board behavior

The position process detail page SHALL remain usable on small screens.

#### Scenario: Small-screen board usability

- **WHEN** the page is viewed on a small viewport
- **THEN** users can still view stage columns, read card content, and perform stage changes without layout breakage

#### Scenario: Back action remains available on small screens

- **WHEN** the page is viewed on a small viewport
- **THEN** the back button remains visible and operable

### Requirement: Automated render and interaction validation

The implementation MUST be verifiable through browser automation for rendering and core interaction behavior.

#### Scenario: Render validation via Playwright and Chrome DevTools MCP

- **WHEN** automated browser checks execute for the position process detail route
- **THEN** tests validate title rendering, column rendering, candidate card content, and navigation behavior

#### Scenario: Drag and drop validation via automation

- **WHEN** automated browser checks perform a card move between stages
- **THEN** tests validate that the candidate appears in the target stage and stage update behavior is executed
