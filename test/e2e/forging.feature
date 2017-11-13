Feature: Forging tab
  Scenario: should allow to view forging center if account is delegate and should show more blocks on scroll
    Given I'm logged in as "delegate"
    When I click tab number 3
    Then I should see forging center
    And I should see table with 20 lines
    And I scroll to the bottom
    And I should see table with 40 lines

