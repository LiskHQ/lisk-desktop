Feature: Forging tab
  Scenario: should allow to view forging center if account is delegate and should show more blocks on scroll
    Given I'm logged in as "delegate"
    When I click forging tab
    Then I should see forging center
    And I should see table with 20 lines
    And I scroll to the bottom of "box"
    And I should see table with 40 lines

