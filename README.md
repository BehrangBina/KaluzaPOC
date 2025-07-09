# Agify API Test Automation Framework

This project demonstrates a comprehensive API testing approach using Behavior-Driven Development (BDD) with TypeScript and Cucumber. 

We're testing the [Agify.io API](https://agify.io/documentation), which predicts someone's age based on their first name. Think of it as a fun way to showcase serious testing skills.

## What This Project Does

This framework tests the Agify API thoroughly. We cover the happy paths, edge cases, error scenarios, and advanced features like batch processing and localization. Every test runs against the real API, so you see authentic behavior.

The tests are written in plain English using Gherkin syntax, making them readable for anyone on your team - technical or not.

## Quick Start

Get up and running in under 2 minutes:

### Prerequisites

You'll need Node.js installed on your machine. We've tested this with Node.js 16+ and npm 7+.

### Installation

```bash
# Clone the repository
git clone https://github.com/BehrangBina/KaluzaPOC.git
cd KaluzaPOC

# Install dependencies
npm install

# Run the tests
npm run test
```

That's it! You should see all 7 scenarios passing with detailed output.

### Generate a Pretty Report

Want to see your results in a nice HTML format?

```bash
npm run test:report
```

This creates an HTML report in the `reports/` directory that you can share with your team.

## What We're Testing

Our test suite covers everything the Agify API can do:

### Basic Functionality

- **Valid names**: Testing with real names like "michael" to get age predictions
- **Names with numbers**: Seeing how the API handles "john123" 

### Error Handling

- **Missing parameters**: What happens when you forget the name parameter
- **Empty values**: Testing edge cases with empty strings

### Advanced Features

- **Localization**: Getting country-specific predictions (US vs UK naming patterns)
- **Batch processing**: Testing multiple names in a single request
- **Rate limiting**: Checking that API headers work correctly

### Real Examples

Here's what a typical test looks like in plain English:

```gherkin
Scenario: Valid name returns estimated age
  Given I have the name "michael"
  When I send a GET request to the Agify API
  Then the response status should be 200
  And the response should contain a name "michael"
  And the response should contain an age
  And the response should contain a count
```

No technical jargon. Anyone can understand what this test does.

## Project Structure

We've organized everything to make sense at first glance:

```
KaluzaPOC/
├── tests/
│   ├── features/                 # Your test scenarios in plain English
│   │   └── agify.feature        # All 7 test scenarios
│   ├── step_definitions/         # The code that runs your scenarios  
│   │   └── agify.steps.ts       # Connects English to TypeScript
│   └── support/                  # Behind-the-scenes helpers
│       ├── api/
│       │   └── agify.ts         # Handles all API communication
│       └── world.ts             # Shares data between test steps
├── reports/                      # Test results and reports
├── package.json                  # Project dependencies and scripts
├── cucumber.js                   # Test runner configuration
└── tsconfig.json                # TypeScript settings
```

### Why This Structure Works

**Separation of concerns**: Each file has one job. Test scenarios stay readable, API logic stays organized, and step definitions act as the bridge between them.

**Easy to extend**: Want to test a new API endpoint? Add scenarios to the feature file and extend the API client. The structure scales naturally.

**Team-friendly**: Non-technical folks can read and contribute to feature files, while developers focus on the implementation details.

## Architecture Highlights

We've built this following industry best practices:

### SOLID Principles in Action

**Single Responsibility**: Each module does one thing well. The API client handles HTTP requests, step definitions handle test logic, and feature files describe behavior.

**Open/Closed**: Easy to extend with new test scenarios without modifying existing code.

**Interface Segregation**: Clean TypeScript interfaces that define exactly what each part needs.

**Dependency Inversion**: Step definitions depend on abstractions, not concrete implementations.

### TypeScript Benefits

We use TypeScript throughout for:

- **Type safety**: Catch errors before runtime
- **Better IDE support**: Autocomplete and refactoring
- **Self-documenting code**: Interfaces tell you exactly what to expect

### Robust Error Handling

Our API client handles everything gracefully:

- Network timeouts
- HTTP error responses  
- Malformed responses
- Server outages

You get meaningful error messages that help debug issues quickly.

## Test Scenarios Covered

### Comprehensive Coverage

1. **Basic functionality**: Standard API usage with valid inputs
2. **Edge cases**: Empty parameters, special characters, unusual names
3. **Error conditions**: Missing parameters, invalid requests
4. **Advanced features**: Batch requests, localization, rate limiting
5. **Performance awareness**: Response time validation through headers

### Real API Integration

These tests hit the actual Agify API, not mocks. This means:

- You see real response times
- You catch actual API changes
- You validate real-world behavior
- You test against production-like conditions

## Running Different Test Scenarios

### Run Everything

```bash
npm run test
```

### Generate Reports

```bash
npm run test:report
```

### Debug Mode

If tests fail, check the console output. Each request and response gets logged with timing information.

## Extending the Framework

### Adding New Test Scenarios

1. **Write the scenario** in `tests/features/agify.feature` using Gherkin syntax
2. **Run the test** - Cucumber will suggest step definitions for any missing steps
3. **Implement the steps** in `tests/step_definitions/agify.steps.ts`
4. **Extend the API client** if needed in `tests/support/api/agify.ts`

### Testing Other APIs

This structure works for any REST API. Copy the pattern:

1. Create new feature files for your API
2. Build API clients in the support directory
3. Write step definitions that connect scenarios to your API client

## Technical Details

### Dependencies

**Core testing stack**:

- `@cucumber/cucumber`: BDD test runner
- `typescript`: Type safety and modern JavaScript features
- `chai`: Assertion library with readable syntax
- `axios`: HTTP client for API requests

**Development tools**:

- `ts-node`: Run TypeScript directly
- Various TypeScript type definitions

### Node.js and npm Versions

Tested with:

- **Node.js**: 16.x, 18.x, 20.x
- **npm**: 7.x, 8.x, 9.x

Should work with any recent Node.js version, but we recommend Node.js 18+ for the best experience.

### Browser Support

This is a Node.js API testing framework. No browser required.

## Troubleshooting

### Common Issues

**Tests fail with network errors**: Check your internet connection. These tests hit the real Agify API.

**TypeScript compilation errors**: Run `npm install` to ensure all dependencies are installed.

**Cucumber can't find steps**: Check that your step definitions file is in the right location and properly exported.

### Getting Help

Look at the console output first. Logging shows you exactly what requests are being made and what responses you're getting.

## Why This Approach Works

**Readable by everyone**: Stakeholders can understand what you're testing without knowing code.

**Maintainable**: Clear structure means changes don't break everything else.

**Reliable**: Tests against real APIs catch real problems.
