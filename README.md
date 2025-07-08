# KaluzaPOC
Create BDD scenarios and step definitions to test agify.io

## Folder Structure

```
tests/
  features/                → Gherkin .feature files (test scenarios)
  step_definitions/        → Step definitions (glue code for Gherkin steps)
  support/
    api/                   → API clients/wrappers (encapsulate HTTP logic)
    config/                → Environment configs (URLs, tokens, etc.)
    utils/                 → Reusable helpers (e.g., response validators, data builders)
```

### Why This Structure?

- **Separation of Concerns:**  
  Each layer has a single responsibility, making the codebase easier to maintain and extend.

- **Testability:**  
  API logic is decoupled from step definitions, making it easy to mock or stub for unit/integration tests.

- **Scalability:**  
  New APIs, helpers, or environments can be added without disrupting existing code.

- **Readability:**  
  Feature files remain business-readable, while technical details are abstracted away.

This structure ensures your test automation codebase remains organized, robust, and easy to work with as it evolves.

