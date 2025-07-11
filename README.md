# Agify API Test Suite

This repository demonstrates **how we write production-quality API tests in JavaScript/TypeScript using Cucumber and Behavior-Driven Development (BDD)**.  It serves two purposes:

## Table of Contents

1. [Why This Stack?](#why-this-stack)
2. [Quick Start](#quick-start)
3. [Project Structure](#project-structure)
4. [Running the Tests](#running-the-tests)
5. [Allure Reports](#allure-reports)
6. [Continuous Integration](#continuous-integration)
7. [Extending the Suite](#extending-the-suite)
8. [Troubleshooting](#troubleshooting)

---

## Why This Stack?

| Concern | Our Choice | Rationale | Common Alternatives |
|---------|------------|-----------|---------------------|
| **Test Style** | **Cucumber (Gherkin syntax)** | Keeps business intent readable for non-dev stakeholders; great for hiring demos. | Jest / Mocha provide unit-style specs but aren’t human-readable. |
| **Language** | **TypeScript** | Static typing eliminates whole classes of runtime errors and improves IDE hints. | JavaScript (looser type safety). |
| **Mocking** | **Nock** | Lightweight HTTP interceptor; zero dependencies on external servers. | MSW, WireMock (heavier to configure). |
| **Reporting** | **Allure** | Generates attractive, navigable HTML reports with step screenshots & attachments. | Jest HTML reporters (less interactive). |
| **Logging** | **Pino** | Fast, structured logs; pipeable to pretty printers or JSON sinks. | Winston (larger, slower). |

> **In short:** I picked **the simplest tools that still give us strong typing, business friendly syntax, and solid reporting**.  Everything lives in plain Node.js. no Docker, no heavyweight frameworks, so you can clone and run in under a minute.

---

## Quick Start

```bash
# 1. Install dependencies
npm ci

# 2. Run fast local tests against a mocked API
npm run test:mock

# 3. (Optional) Hit the real Agify service
npm test
```

> Requires Node.js ≥18 and npm ≥9.

---

## Project Structure

```text
KaluzaPOC/
├── tests/
│   ├── features/
│   │   ├── age_estimation/         # Single-name scenarios
│   │   ├── batch_processing/       # Batch requests (+ edge cases)
│   │   ├── rate_limiting/          # Quota / header checks
│   │   └── authentication/         # API-key scenarios
│   ├── step_definitions/           # Glue code mapping steps → actions
│   └── support/                    # Helpers: API client, mocks, logger, world
├── src/                            # (Optional) production code / shared libs
├── reports/                        # Generated HTML reports live here
├── cucumber.js                     # Cucumber CLI configuration
└── tsconfig.json                   # TypeScript compiler options
```

Key concepts:

* **Custom World** pattern (`tests/support/world.ts`) injects context, DI containers, and helpers into each scenario.
* **Ports & Adapters** – the API client is abstracted behind an interface so tests can swap real vs mocked backends.

## Running the Tests

### 1. Against the Mock Server (fastest)

Sets `USE_MOCK=true`, intercepting HTTP calls with deterministic fixtures.

```bash
npm run test:mock
```

### 2. Against the Live API (integration)

Hits `https://api.agify.io` directly; ideal for smoke checks and contract tests.

```bash
npm test
```

Environment variables you can tweak:

| Variable | Default | Purpose |
|----------|---------|---------|
| `USE_MOCK` | `false` | Toggle mock adapter. |
| `BASE_URL` | `https://api.agify.io` | Target URL for live tests. |
| `LOG_LEVEL` | `info` | Pino log level. |

---

## Allure Reports

Generate and open a beautiful HTML dashboard:

```bash
# Create fresh report under /allure-report
npm run report:allure

# Then open allure-report/index.html in your browser
```

The report captures every Cucumber step, request/response payloads, and console logs—perfect for attaching to a pull-request or interview submission.

---

## Continuous Integration

We ship a ready-to-run **GitHub Actions** workflow (`.github/workflows/ci.yml`).  It:

1. Checks out code and caches `node_modules`.
2. Runs ESLint + Prettier checks.
3. Compiles TypeScript (`tsc --noEmit`) to enforce type safety.
4. Executes mock tests on Node 18 & 20.
5. Publishes an Allure report artifact for easy download.

### Publishing Allure Report to GitHub Pages

After the test job finishes, the workflow uploads the generated **Allure HTML** bundle and deploys it via **GitHub Pages**. This gives you a permanent, shareable dashboard for every main-branch run.

 **Live report:** https://behrangbina.github.io/KaluzaPOC/

 **Example workflow run:** https://github.com/BehrangBina/KaluzaPOC/actions/runs/16198505125

A minimal excerpt of the deployment logic looks like this:

```yaml
jobs:
  test:
    # … linter, type-check, tests …
    - name: Upload Allure site as Pages artifact
      uses: actions/upload-pages-artifact@v3
      with:
        path: allure-report

  deploy:
    needs: test
    permissions:
      pages: write      # allow pushing to gh-pages
      id-token: write   # enable OIDC authentication
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

That's it each push automatically refreshes the hosted Allure report, making test results instantly accessible to reviewers, teammates, and hiring managers.

---

## Extending the Suite

1. **Add a Scenario**
   * Pick the right folder under `tests/features/` (e.g. `age_estimation/`).
   * Write steps in plain English—no code required.
2. **Create/Reuse Step Definitions**
   * If new behaviour is needed, add a matcher in `tests/step_definitions/`.
   * Keep the glue thin; push logic into helper classes under `tests/support/`.
3. **Mock the Response** (optional)
   * Add a fixture in `tests/support/mocks/` and update the mock adapter.
4. **Run `npm run test:mock`** – ensure green locally before opening a PR.

---

## Troubleshooting

| Problem | Likely Cause | Fix |
|---------|--------------|-----|
| `ECONNREFUSED` when hitting live API | Firewall or Agify outage | Retry later or use mock mode. |
| Tests pass locally but fail in CI | Missing env var | Confirm secrets & env config in Actions. |
| No report generated | `allure-results` folder empty | Ensure tests actually executed; check Cucumber output. |

1. `npm run lint` passes with no errors.
2. All tests (`mock` & `live`) are green.
3. New code paths are covered, aim for ≥80 % line coverage.

---

### Final Note for Reviewers

This repository is intentionally **lightweight**. No complicated Docker Compose files, no sprawling micro-service demos.  I believe **clarity beats cleverness** when you're assessing engineering skill:

* **Readable Scenarios** prove details for  the non-technical stakeholders.
* **Typed, hexagonal helpers** show design discipline without over-engineering.
* **Fast feedback loops** (mock tests <1 s) highlight CI efficiency.

If you’d like to discuss the design trade-offs feel free to reach out 😄
