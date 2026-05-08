## 1. Routing and Navigation

- [ ] 1.1 Add a route for the position process detail page with position id path params.
- [ ] 1.2 Wire the "Ver proceso" action in the positions list to navigate to the new detail route.
- [ ] 1.3 Implement a visible back button in the detail page that returns to positions list.

## 2. Data Services and View Model

- [ ] 2.1 Add/extend frontend service methods for GET /positions/:id/interviewFlow and GET /positions/:id/candidates.
- [ ] 2.2 Add/extend frontend service method for PUT /candidates/:id/stage.
- [ ] 2.3 Implement page load logic that fetches interview flow and candidates in parallel.
- [ ] 2.4 Build a stage-grouped board view model that maps candidates to the correct stage column.

## 3. Kanban UI Rendering

- [ ] 3.1 Build the position process page header including title and back action.
- [ ] 3.2 Implement board columns rendering one column per interview flow stage.
- [ ] 3.3 Implement candidate card component rendering full name and average score.
- [ ] 3.4 Ensure empty stage columns render as valid visible drop targets.

## 4. Drag-and-Drop Stage Management

- [ ] 4.1 Implement drag-and-drop interactions for moving candidate cards between stage columns.
- [ ] 4.2 Apply optimistic UI updates when a candidate is dropped into a new stage.
- [ ] 4.3 Persist stage changes through PUT /candidates/:id/stage on drop.
- [ ] 4.4 Implement rollback/error handling so UI remains consistent if stage update fails.

## 5. Responsive and Accessibility Hardening

- [ ] 5.1 Implement responsive styles for small screens with usable horizontal board navigation.
- [ ] 5.2 Verify back button and card content remain readable and operable on mobile viewports.
- [ ] 5.3 Add keyboard/focus handling and semantics needed for usable drag-and-drop interactions.

## 6. Automated Testing and Validation

- [ ] 6.1 Add tests for route navigation from positions list to process detail and back.
- [ ] 6.2 Add tests for board rendering: title, stage columns, candidate cards, and empty columns.
- [ ] 6.3 Add tests for drag-and-drop stage transitions including stage persistence behavior.
- [ ] 6.4 Add negative-path tests covering failed PUT /candidates/:id/stage handling.
- [ ] 6.5 Run Playwright validation for process detail rendering and interaction behavior.
- [ ] 6.6 Validate responsive rendering and interaction behavior with Chrome DevTools MCP checks.
