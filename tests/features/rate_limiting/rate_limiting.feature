Feature: Rate limiting behavior of Agify API

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