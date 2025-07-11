Feature: Estimate age for a single valid name

  Scenario: Valid name returns estimated age
    Given I have the name "michael"
    When I send a GET request to the Agify API
    Then the response status should be 200
    And the response should contain a name
    And the response should contain an age 