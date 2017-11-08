Feature: Account management
  Scenario: should allow to save account locally, after page reload it should require passphrase to do the first transaction, and remember the passphrase for next transactions
    Given I'm logged in as "genesis"
    When I click "save account" in main menu
    And I click "save account button"
    And I wait 1 seconds
    And I should see text "Account saved" in "toast" element
    And I refresh the page
    And I wait 2 seconds
    Then I should be logged in
    And I click "send button"
    And I should see empty "passphrase" field
    And I fill in "1" to "amount" field
    And I fill in "537318935439898807L" to "recipient" field
    And I fill in passphrase of "genesis" to "passphrase" field
    And I click "submit button"
    And I click "ok button"
    And I wait 1 seconds
    And I click "send button"
    And I fill in "2" to "amount" field
    And I fill in "537318935439898807L" to "recipient" field
    And I click "submit button"
    And I should see alert dialog with title "Success" and text "Your transaction of 2 LSK to 537318935439898807L was accepted and will be processed in a few seconds."

  Scenario: should allow to forget locally saved account
    Given I'm logged in as "any account"
    When I click "save account" in main menu
    And I click "save account button"
    And I refresh the page
    And I wait 2 seconds
    And I click "forget account" in main menu
    And I wait 1 seconds
    Then I should see text "Account was successfully forgotten." in "toast" element
    And I refresh the page
    And I should be on login page

  @integration
  Scenario: should allow to exit save account dialog with "cancel button"
    Given I'm logged in as "any account"
    When I click "save account" in main menu
    And I click "cancel button"
    Then I should see no "modal dialog"

  @integration
  Scenario: should allow to exit save account dialog with "x button"
    Given I'm logged in as "any account"
    When I click "save account" in main menu
    And I click "x button"
    Then I should see no "modal dialog"
