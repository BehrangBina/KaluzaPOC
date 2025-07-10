# Agify API Test Automation Framework

Hey there! Welcome to our project. We've built a simple but powerful tool to automatically test a fun public API called [Agify.io](https://agify.io/documentation).

## So, what's an API?

Imagine you're at a restaurant. You don't go into the kitchen to cook your food, right? You give your order to a waiter (the API), who takes it to the kitchen, and then brings the food back to you.

An API (Application Programming Interface) is just like that waiter. It's a way for different software programs to talk to each other. In our case, our testing program sends a name to the Agify API, and it sends back a guess about how old someone with that name might be.

### What does this project do?

This project automatically tests the Agify API to make sure it's working correctly. Think of it like having a robot that goes to the restaurant every day and orders the same meals to make sure the kitchen is still working properly.

**What you'll need:**

* A little program called Node.js. If you don't have it, you can [download it from the official website](https://nodejs.org/).

**Installation Steps:**

1. First, download all the project files to your computer (this is called "cloning").
2. Open your terminal or command prompt.
3. Navigate to the project folder.
4. Type `npm install` and press Enter. This downloads all the helper tools we need.

## Running the Tests

We've set up three different ways to run our tests:

### Option 1: Testing with a Mock Server (Recommended for Development)

This is like having a pretend restaurant that always gives you the same food, no matter what you order. It's great for testing because:

* It's super fast
* It doesn't use up your daily API requests
* It works even when you don't have internet

To run the tests against the mock server:

```bash
npm run test:mock
```

### Option 2: Testing the Real API

This actually talks to the real Agify website. It's slower and uses up your daily free requests, but it tests the real thing.

To run the tests against the live API:

```bash
npm run test
```

### Option 3: Viewing an Allure Report

Generate the beautiful Allure HTML report with:

```bash
npm run report:allure
```

This command converts the raw files in `allure-results/` into a full HTML dashboard inside `allure-report/`.  Open `allure-report/index.html` in your browser to explore results, drill into steps, and view logs or attachments.

## Automating Tests with GitHub Actions

This is where things get really cool. We have already set up a system that automatically runs your tests every time you make changes to your code and push them to GitHub.

Here's what's already configured in your project:

### What Happens Automatically

Every time you push code to GitHub, our system will:

1. **Set up a clean testing environment** * Like getting a fresh computer just for testing
2. **Install all the necessary tools** * All the helper programs we need
3. **Run all your tests using the mock server** * Fast and reliable testing
4. **Generate a beautiful HTML report** * Easy to read results
5. **Save the results** * You can download the reports later if needed

### How to See the Results

1. Go to your GitHub repository page
2. Click on the "Actions" tab at the top
3. You'll see a list of all the test runs
4. Click on any run to see the details
5. If tests fail, you'll see exactly what went wrong

### What Gets Tested

Our test suite covers a comprehensive range of scenarios:

**Basic Functionality:**

* Valid names return age estimates
* Names with numbers are handled correctly
* Names with special characters (like "José") work properly

**Advanced Features:**

* Country*specific results (like "Peter" in the US vs UK)
* Batch requests (testing multiple names at once)
* Authentication with API keys

**Error Handling:**

* Missing name parameters
* Invalid API keys
* Rate limit exceeded scenarios
* Too many names in a batch request

**Edge Cases:**

* Empty requests
* Very long names
* Special characters and diacritics

## Project Structure

Here's how the project is organized:

```text
KaluzaPOC/
├── tests/
│   ├── features/
│   │   └── agify.feature          # Test scenarios in plain English
│   ├── step_definitions/
│   │   └── agify.steps.ts         # Code that runs the tests
│   └── support/
│       ├── api/
│       │   └── agify.ts           # Helper functions for API calls
│       ├── mocks/
│       │   └── agifyApi.mock.ts   # Fake API responses for testing
│       ├── logger.ts              # Logging system
│       └── world.ts               # Test environment setup
├── reports/                       # Test results go here
├── .github/workflows/
│   └── ci.yml                     # GitHub Actions configuration
├── cucumber.js                    # Test runner configuration
├── package.json                   # Project dependencies and scripts
└── README.md                      # This file!
```

## Understanding the Test Results

When you run the tests, you'll see output that looks something like this:

```text
 Valid name returns estimated age
 Name with numbers returns an error or default
 Name with diacritics is handled correctly
 Exceeding rate limit returns error
```

* **Green checkmarks** mean the test passed
* **Red X marks** mean the test failed
* The descriptions tell you exactly what each test was checking

## Troubleshooting

**"Command not found" errors:** Make sure you have Node.js installed and you're in the right folder.

**Tests failing unexpectedly:** Try running `npm run test:mock` first. If mock tests pass but real API tests fail, it might be because:

* Your internet connection is slow
* The API is temporarily down
* You've hit the daily rate limit

**No test report generated:** Make sure you have a `reports/` folder in your project. The system should create it automatically, but you can create it manually if needed.

## Contributing

Want to add more tests? Great! Here's how:

1. **Add a new scenario** to `tests/features/agify.feature` in plain English
2. **Create a mock response** in `tests/support/mocks/agifyApi.mock.ts` 
3. **Add step definitions** in `tests/step_definitions/agify.steps.ts` if needed
4. **Run the tests** to make sure everything works

The beauty of this system is that it's designed to be readable by anyone, even if you're not a programmer!

## Need Help?

If you get stuck, remember:

* The mock tests should always pass (they're testing our fake API)
* The real API tests might occasionally fail due to network issues
* Check the GitHub Actions tab to see automated test results
* The HTML reports give you detailed information about what went wrong
