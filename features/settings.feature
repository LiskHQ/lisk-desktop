Feature: Settings dialog
  Scenario: should allow to change language
    Given I'm logged in as "any account"
    When I click "settings" in main menu
    And I select option no. 2 from "language" select
    Then I should see text "SENDEN" in "send button" element
