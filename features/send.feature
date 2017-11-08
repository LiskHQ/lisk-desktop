Feature: Send dialog
  @testnet
  Scenario: should allow to send when enough funds and correct address form
    Given I'm logged in as "genesis"
    When I click "send button"
    And I fill in "1" to "amount" field
    And I fill in "537318935439898807L" to "recipient" field
    And I click "submit button"
    Then I should see alert dialog with title "Success" and text "Your transaction of 1 LSK to 537318935439898807L was accepted and will be processed in a few seconds."

  @integration
  Scenario: should not allow to send when not enough funds
    Given I'm logged in as "empty account"
    When I click "send button"
    And I fill in "1" to "amount" field
    And I fill in "537318935439898807L" to "recipient" field
    Then I should see "Insufficient funds" error message

  @integration
  Scenario: should allow to exit send dialog
    Given I'm logged in as "any account"
    When I click "send button"
    And I wait 1 seconds
    And I click "cancel button"
    Then I should see no "modal dialog"

  Scenario: should allow to send with second passphrase
    Given I'm logged in as "second passphrase account"
    When I click "send button"
    And I fill in "1" to "amount" field
    And I fill in "537318935439898807L" to "recipient" field
    And I fill in second passphrase of "second passphrase account" to "second passphrase" field
    And I click "submit button"
    Then I should see alert dialog with title "Success" and text "Your transaction of 1 LSK to 537318935439898807L was accepted and will be processed in a few seconds."
