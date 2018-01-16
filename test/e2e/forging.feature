Feature: Forging page
  Scenario: should allow to view forging center if account is delegate and should show more blocks on scroll
    Given I'm logged in as "delegate"
    When I click "forging" menu
    Then I should see forging center
    And I should see table with 40 lines
    And I scroll to the bottom of "forging"
    And I should see table with 60 lines

