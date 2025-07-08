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

---

## 2. Apply SOLID Principles + Design Patterns

### SOLID in TypeScript Automation Context

- **S (Single Responsibility):**  
  Each module (e.g., API client) does one thing.

- **O (Open/Closed):**  
  Use interfaces to support swappable HTTP libraries (e.g., axios, fetch).

- **L (Liskov Substitution):**  
  Design step definitions that can accept extended test data (e.g., via tables).

- **I (Interface Segregation):**  
  Clients and services expose minimal interfaces.

- **D (Dependency Inversion):**  
  Inject config/headers rather than hardcoding.

### Design Patterns

- **Factory:**  
  Create API clients with injected base URLs.

- **Builder:**  
  For request payloads if they become complex.

- **Strategy:**  
  For mocking behavior or switching environments.

