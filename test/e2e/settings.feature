Feature: Settings dialog
  Scenario: should allow to change language
    Given I'm logged in as "any account"
    When I click "more menu"
    And I wait 0.4 seconds
    And I click 3 item in setting carousel
    And I wait 0.4 seconds
    And I change the language to German
    Then I should see text "Weiter" in "send next button" element
