Feature: Send dialog
  @testnet
  Scenario: should allow to send when enough funds and correct address form
    Given I'm logged in as "genesis"
    And I fill in "1" to "amount" field
    And I fill in "537318935439898807L" to "recipient" field
    And I click "send next button"
    And I click "send button"
    And I wait 1 seconds
    Then I should see "Transaction is being processed and will be confirmed. It may take up to 15 minutes to be secured in the blockchain." modal message

  @integration
  Scenario: should not allow to send when not enough funds
    Given I'm logged in as "empty account"
    And I fill in "1" to "amount" field
    And I fill in "537318935439898807L" to "recipient" field
    Then I should see "Insufficient funds" error message
    And "send next button" should be disabled

  Scenario: should allow to send with second passphrase
    Given I'm logged in as "second passphrase account"
    And I fill in "1" to "amount" field
    And I fill in "537318935439898807L" to "recipient" field
    And I click "send next button"
    And I fill in second passphrase of "second passphrase account" to "second passphrase" field
    When I click "send button"
    And I wait 1 seconds
    Then I should see "Transaction is being processed and will be confirmed. It may take up to 15 minutes to be secured in the blockchain." modal message
