Feature: Estimate age by name using Agify API

  # Basic functionality tests
  Scenario: Valid name returns estimated age
    Given I have the name "michael"
    When I send a GET request to the Agify API
    Then the response status should be 200
    And the response should contain a name "michael"
    And the response should contain an age
    And the response should contain a count

  Scenario: Name with numbers is handled gracefully
    Given I have the name "john123"
    When I send a GET request to the Agify API
    Then the response status should be 200
    And the age should be null or a number

  # Error handling tests
  Scenario: Missing name parameter returns error
    Given I have no name parameter
    When I send a GET request to the Agify API
    Then the response status should be 422
    And the response should contain error "Missing 'name' parameter"

  Scenario: Empty name parameter returns empty result  
    Given I have an empty name ""
    When I send a GET request to the Agify API
    Then the response status should be 200
    And the response should contain a count 0
    And the response should contain null age

  # Localization tests
  Scenario: Name with country localization
    Given I have the name "michael"
    And I specify country "US"
    When I send a GET request to the Agify API
    Then the response status should be 200
    And the response should contain a name "michael"
    And the response should contain an age

  # Batch processing tests
  Scenario: Multiple names in single request
    Given I have multiple names "michael,matthew,jane"
    When I send a batch GET request to the Agify API
    Then the response status should be 200
    And the response should be an array of 3 predictions
    And each prediction should contain name and age

  # Rate limiting tests
  Scenario: Response includes rate limit headers
    Given I have the name "test"
    When I send a GET request to the Agify API
    Then the response status should be 200
    And the response should include rate limit headers

  # Authentication tests
  Scenario: Invalid API key returns unauthorized error
    Given I have the name "test"
    And I use an invalid API key "INVALID_KEY"
    When I send a GET request to the Agify API
    Then the response status should be 401
    And the response should contain error "Invalid API key"
  # Batch processing edge cases
  Scenario: More than 10 names in a batch request returns error
    Given I have a list of 11 names
    When I send a batch GET request to the Agify API
    Then the response status should be 422
    And the response should contain error "Invalid 'name' parameter"
  Scenario: Empty list of names in batch request returns error
    Given I have an empty list of names
    When I send a batch GET request to the Agify API
    Then the response status should be 422
    And the response should contain error "Missing 'name' parameter"
  # Input fallback tests
  Scenario: Name with diacritics is handled correctly
    Given I have the name "René"
    When I send a GET request to the Agify API
    Then the response status should be 200
    And the response should contain a name "René"
    And the response should contain an age
  Scenario: Batch request with country localization
    Given I have multiple names "michael,sofia"
    And I specify country "US"
    When I send a batch GET request to the Agify API
    Then the response status should be 200
    And the response should be an array of 2 predictions
    And each prediction should have a country_id "US"
  # Rate limiting test
  Scenario: Exceeding rate limit returns error
    Given I have the name "test"
    And I have exceeded my request limit
    When I send a GET request to the Agify API
    Then the response status should be 429
    And the response should contain error "Request limit reached"
