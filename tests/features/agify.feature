Feature: Estimate age by name using Agify API

  Scenario: Valid name returns estimated age
    Given I have the name "billybob"
    When I send a GET request to the Agify API
    Then the response status should be 200
    And the response should contain a name
    And the response should contain an age

  Scenario: Name with numbers returns an error or default
    Given I have the name "john123"
    When I send a GET request to the Agify API
    Then the response status should be 200
    And the age should be null or a number

  Scenario: Empty name returns an error
    Given I have no name
    When I send a GET request to the Agify API
    Then the response status should be 400