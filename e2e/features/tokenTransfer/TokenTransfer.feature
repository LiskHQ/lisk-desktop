Feature: Token Transfer
  Background: Add an account and navigate to wallet
    Given I add an account with passphrase "attract squeeze option inflict dynamic end evoke love proof among random blanket table pumpkin general impose access toast undo extend fun employ agree dash" password "Password@1" name "genesis_0" custom derivation path "m/44'/134'/0'"
    And I go to page "wallet"
    And I wait for "1 seconds"
    And I click on a button with exact text "Send"
    Then I should see "Send tokens"
    And button with text "Continue to summary" should be disabled

  Scenario: Enable Continue to summary when enough data has been provided
    Given I type "1" in "amount"
    And I type "lskguo9kqnea2zsfo3a6qppozsxsg92nuuma3p7ad" in "recipient"
    Then button with text "Continue to summary" should be enabled

  Scenario: Transaction Summary should show correct info
    Given I type "1" in "amount"
    And I type "lskguo9kqnea2zsfo3a6qppozsxsg92nuuma3p7ad" in "recipient"
    And I click on a button with exact text "Continue to summary"
    Then I should see "Transaction Summary"
    And I should see "1 LSK"
    And I should see text "lskguo9kqnea2zsfo3a6qppozsxsg92nuuma3p7ad" in a sibling to element with text "Recipient address"

  Scenario: Enter account password should have disabled button until password is typed
    Given I type "1" in "amount"
    And I type "lskguo9kqnea2zsfo3a6qppozsxsg92nuuma3p7ad" in "recipient"
    And I click on a button with exact text "Continue to summary"
    And I click on a button with exact text "Send"
    Then I should see "Enter your account password"
    And button with text "Confirm and Sign" should be disabled
    Given I type "Password@1" in "password"
    Then button with text "Confirm and Sign" should be enabled

  Scenario: Send token to an existing account
    Given I type "1" in "amount"
    And I type "lskguo9kqnea2zsfo3a6qppozsxsg92nuuma3p7ad" in "recipient"
    And I click on a button with exact text "Continue to summary"
    And I click on a button with exact text "Send" inside of testId "dialog-container"
    And I type "Password@1" in "password"
    And I click on a button with exact text "Confirm and Sign"
    And I wait for "1 seconds"
    Then I should see "Transaction submitted"
    Given I click on a button with exact text "Back to wallet"
    Then I should be redirected to route: "wallet"
