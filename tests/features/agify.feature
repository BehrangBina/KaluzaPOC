Feature: Estimate age by name using Agify API

  Scenario: Valid name returns estimated age
    Given I have the name "michael"
    When I send a GET request to the Agify API
    Then the response status should be 200
    And the response should contain a name
    And the response should contain an age

  Scenario: Name with numbers returns an error or default
    Given I have the name "john123"
    When I send a GET request to the Agify API
    Then the response status should be 200
    And the age should be null or a number

  Scenario: Name with diacritics is handled correctly
    Given I have the name "rené"
    When I send a GET request to the Agify API
    Then the response status should be 200
    And the response should contain a name
    And the response should contain an age

  Scenario: Name with country localization
    Given I have the name "peter"
    And I have the country "US"
    When I send a GET request to the Agify API
    Then the response status should be 200
    And the response should contain a name
    And the response should contain an age
    And the response should contain a country

  Scenario: Batch request for multiple names
    Given I have the names "alice,bob"
    When I send a GET request to the Agify API
    Then the response status should be 200
    And the response should be an array
    And each item should contain a name and age

  Scenario: Empty name parameter returns error
    Given I have no name
    When I send a GET request to the Agify API
    Then the response status should be 422
    And the response should contain error "Missing 'name' parameter"

  Scenario: Exceeding rate limit returns error
    Given I have the name "test" for rate limit testing
    When I send a GET request to the Agify API
    Then the response status should be 429
    And the response should contain error "Request limit reached"

  Scenario: Response includes rate limit headers
    Given I have the name "test"
    When I send a GET request to the Agify API
    Then the response status should be 200
    And the response should include rate limit headers

  # --- New Scenarios For Increased Coverage ---

  # Authentication tests
  Scenario: Invalid API key returns error
    Given I have the name "test"
    And I have an invalid API key "INVALID_KEY"
    When I send a GET request to the Agify API
    Then the response status should be 401
    And the response should contain error "Invalid API key"

  # Batch processing edge cases
  Scenario: Batch request with too many names
    Given I have too many names in batch
    When I send a GET request to the Agify API
    Then the response status should be 422
    And the response should contain error "Invalid 'name' parameter"

  Scenario: Empty list of names
    Given I have an empty list of names
    When I send a GET request to the Agify API
    Then the response status should be 422
    And the response should contain error "Invalid 'name' parameter"

  # Edge cases and input validation
  Scenario: Name with special characters
    Given I have the name "josé"
    When I send a GET request to the Agify API
    Then the response status should be 200
    And the response should contain a name
    And the response should contain an age

  Scenario: Very long name parameter
    Given I have a very long name
    When I send a GET request to the Agify API
    Then the response status should be 422
    And the response should contain error "Invalid 'name' parameter"

  # Batch with localization
  Scenario: Batch request with country localization
    Given I have the names "maria,carlos"
    And I have the country "BR"
    When I send a GET request to the Agify API
    Then the response status should be 200
    And the response should be an array
    And each item should contain a name and age
    And each item should contain a country