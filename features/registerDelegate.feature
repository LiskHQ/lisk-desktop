Feature: Register delegate
  Scenario: should allow to register a delegate
    Given I'm logged in as "delegate candidate"
    When I click "register as delegate" in main menu
    And I fill in "test" to "username" field
    And I click "register button"
    Then I should see alert dialog with title "Success" and text "Delegate registration was successfully submitted with username: "test". It can take several seconds before it is processed."
    And I click "ok button"
    And I wait 15 seconds
    And I should see text "test" in "delegate name" element 
    And There is no "register as delegate" in main menu

  Scenario: should allow to register a delegate with second passphrase
    Given I'm logged in as "second passphrase account"
    When I click "register as delegate" in main menu
    And I fill in "test2" to "username" field
    And I fill in second passphrase of "second passphrase account" to "second passphrase" field
    And I click "register button"
    Then I should see alert dialog with title "Success" and text "Delegate registration was successfully submitted with username: "test2". It can take several seconds before it is processed."

  @integration
  Scenario: should allow to exit delegate registration dialog
    Given I'm logged in as "genesis"
    When I click "register as delegate" in main menu
    And I click "cancel button"
    Then I should see no "modal dialog"

  @integration
  Scenario: should not allow to register delegate if not enough funds for the fee
    Given I'm logged in as "empty account"
    When I click "register as delegate" in main menu
    Then I should see "Insufficient funds for 25 LSK fee" error message
    And "register button" should be disabled


