Feature: Forging tab
  Scenario: should allow to view forging center if account is delegate
    Given I'm logged in as "delegate"
    When I click tab number 3
    Then I should see forging center

  Scenario: should show more blocks on scroll
    Given I'm logged in as "delegate"
    When I click tab number 3
    Then I should see table with 20 lines
    When I scroll to the bottom
    Then I should see table with 40 lines
