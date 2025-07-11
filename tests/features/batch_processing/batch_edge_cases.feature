Feature: Validate batch request edge cases

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