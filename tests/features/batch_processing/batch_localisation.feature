Feature: Batch age estimation with country localisation

  Scenario: Batch request with country localization
    Given I have the names "maria,carlos"
    And I have the country "BR"
    When I send a GET request to the Agify API
    Then the response status should be 200
    And the response should be an array
    And each item should contain a name and age
    And each item should contain a country 