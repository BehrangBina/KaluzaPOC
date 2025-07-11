Feature: Estimate age with country localisation

  Scenario: Name with country localization
    Given I have the name "peter"
    And I have the country "US"
    When I send a GET request to the Agify API
    Then the response status should be 200
    And the response should contain a name
    And the response should contain an age
    And the response should contain a country 