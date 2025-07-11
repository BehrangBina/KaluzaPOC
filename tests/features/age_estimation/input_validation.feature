Feature: Validate name parameter for single-name requests

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

  Scenario: Empty name parameter returns error
    Given I have no name
    When I send a GET request to the Agify API
    Then the response status should be 422
    And the response should contain error "Missing 'name' parameter" 