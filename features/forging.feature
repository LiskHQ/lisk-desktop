Feature: Forging tab
  @ignore
  Scenario: should allow to view forging center if account is delegate
    Given I'm logged in as "delegate"
    When I click tab number 3
    Then I should see forging center
