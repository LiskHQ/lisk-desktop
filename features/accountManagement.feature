Feature: Account management
  Scenario: should allow save account locally
    Given I'm logged in as "any account"
    When I click "save account" in main menu
    And I click "save account button"
    And I wait 1 seconds
    And I should see text "Account saved" in "toast" element
    And I Refresh the page
    And I wait 2 seconds
    Then I should be logged in
    And I click "send button"
    And I should see empty "passphrase" field

  Scenario: should allow to exit save account dialog with "cancel button"
    Given I'm logged in as "any account"
    When I click "save account" in main menu
    And I click "cancel button"
    Then I should see no "modal dialog"

  Scenario: should allow to exit save account dialog with "x button"
    Given I'm logged in as "any account"
    When I click "save account" in main menu
    And I click "x button"
    Then I should see no "modal dialog"
