Feature: Register second passphrase
  Scenario: should allow to set 2nd passphrase
    Given I'm logged in as "second passphrase candidate"
    When I click "register second passphrase" in main menu
    And I click "next button"
    And I 250 times move mouse randomly
    And I remember passphrase, click "next button", fill in missing word
    And I click "next button"
    Then I should see alert dialog with title "Success" and text "Second passphrase registration was successfully submitted. It can take several seconds before it is processed."

  Scenario: should not allow to set 2nd passphrase again
    Given I'm logged in as "second passphrase account"
    Then There is no "register second passphrase" in main menu

  Scenario: should ask for passphrase for saved account
  Given I'm logged in as "empty account"
    When I click "saved accounts" in main menu
    And I click "add active account button"
    And I click "x button"
    And I wait 1 seconds
    And I refresh the page
    When I click "register second passphrase" in main menu
    And I fill in passphrase of "empty account" to "passphrase" field
    And I click "authenticate button"
    Then I should see "Insufficient funds for 5 LSK fee" error message
    And "next button" should be disabled

  @integration
  Scenario: should not allow to set 2nd passphrase if not enough funds for the fee
    Given I'm logged in as "empty account"
    When I click "register second passphrase" in main menu
    Then I should see "Insufficient funds for 5 LSK fee" error message
    And "next button" should be disabled

  @integration
  Scenario: should allow to exit 2nd passphrase registration dialog
    Given I'm logged in as "genesis"
    When I click "register second passphrase" in main menu
    And I click "cancel button"
    Then I should see no "modal dialog"

