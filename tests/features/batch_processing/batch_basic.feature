Feature: Batch age estimation for multiple names

  Scenario: Batch request for multiple names
    Given I have the names "alice,bob"
    When I send a GET request to the Agify API
    Then the response status should be 200
    And the response should be an array
    And each item should contain a name and age 