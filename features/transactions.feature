Feature: Transactions tab
  Scenario: should show transactions
    Given I'm logged in as "genesis"
    When I click tab number 1
    Then I should see table with 20 lines
