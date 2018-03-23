Feature: Send dialog
  @testnet
  Scenario: should allow to send when enough funds and correct address form
    Given I'm logged in as "genesis"
    And I fill in "1" to "amount" field
    And I fill in "94495548317450502L" to "recipient" field
    And I click "send next button"
    And I click "send button"
    And I wait 1 seconds
    Then I should see text "Transaction is being processed and will be confirmed. It may take up to 15 minutes to be secured in the blockchain." in "result box message" element

  @advanced
  Scenario: should allow to send with second passphrase
    Given I'm logged in as "second passphrase account"
    And I fill in "1" to "amount" field
    And I fill in "94495548317450502L" to "recipient" field
    And I click "send next button"
    And I fill in second passphrase of "second passphrase account" to "second passphrase" field
    And I click "second passphrase next"
    When I click "send button"
    And I wait 1 seconds
    Then I should see text "Transaction is being processed and will be confirmed. It may take up to 15 minutes to be secured in the blockchain." in "result box message" element

  Scenario: should be able to init account if needed
    Given I wait 10 seconds
    And I'm logged in as "without initialization"
    Then I should see "account initialization" element
    When I click "account init button"
    And I click "send button"
    And I wait 1 seconds
    Then I should see text "Transaction is being processed and will be confirmed. It may take up to 15 minutes to be secured in the blockchain." in "result box message" element
    When I click "okay button"
    Then I should see no "account initialization"
    When I refresh the page
    Then I should see no "account initialization"
