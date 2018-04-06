Feature: Register second passphrase
  # TODO: will be re-enabled when the functionality is re-enabled
  @pending
  Scenario: should allow to set 2nd passphrase
    Given I'm logged in as "second passphrase candidate"
    When I click "more menu"
    And I wait 0.4 seconds
    And I click 4 item in setting carousel
    And I wait 0.4 seconds
    And I click "register second passphrase"
    And I click "next button"
    And I 250 times move mouse randomly
    And I wait 1 seconds
    And I click "get passphrase button"
    And I wait 1 seconds
    And I swipe "i understand checkbox" to right
    And I wait 1 seconds
    And I swipe "reveal checkbox" to right
    And I wait 1 seconds
    And I remember passphrase, click "yes its safe button", choose missing words
    And I wait 1 seconds
    And I click "get to your dashboard button"
    Then I should see alert dialog with title "Success" and text "Second passphrase registration was successfully submitted. It can take several seconds before it is processed."

  # TODO: will be re-enabled when the functionality is re-enabled
  @pending
  Scenario: should not allow to set 2nd passphrase again
    Given I'm logged in as "second passphrase account"
    Then There is no "register second passphrase" in main menu

  @pending
  Scenario: should ask for passphrase for saved account
    Given I'm logged in as "empty account"
    And I wait 1 seconds
    And I refresh the page
    And I wait 2 seconds
    When I go to "main/dashboard/register-second-passphrase"
    And I fill in passphrase of "empty account" to "passphrase" field
    And I click "authenticate button"
    Then I should see "Insufficient funds for 5 LSK fee" error message
    And "next button" should be disabled

  @integration
  @pending
  Scenario: should not allow to set 2nd passphrase if not enough funds for the fee
    Given I'm logged in as "empty account"
    When I go to "main/dashboard/register-second-passphrase"
    Then I should see "Insufficient funds for 5 LSK fee" error message
    And "next button" should be disabled

  @integration
  @pending
  Scenario: should allow to exit 2nd passphrase registration dialog
    Given I'm logged in as "genesis"
    When I go to "main/dashboard/register-second-passphrase"
    And I click "cancel button"
    Then I should see no "modal dialog"
