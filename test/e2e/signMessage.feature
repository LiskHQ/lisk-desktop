Feature: Sign message
  Scenario: should allow to send when using launch protocol
    Given I'm logged in as "genesis"
    When I go to "/sign-message?message=my message"
    Then I click "next"
    Then I should see "result" element
