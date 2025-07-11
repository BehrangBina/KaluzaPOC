Feature: Authentication with API key

  Scenario: Invalid API key returns error
    Given I have the name "test"
    And I have an invalid API key "INVALID_KEY"
    When I send a GET request to the Agify API
    Then the response status should be 401
    And the response should contain error "Invalid API key" 