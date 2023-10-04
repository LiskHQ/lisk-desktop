Feature: Wallet
  Background: Add sender and recipient accounts
    Then I go to page "wallet"
    And I click on exact text "Add account"
    Given I wait for "1 seconds"
    Given I add an account with passphrase "fabric vivid advance supreme custom rail owner shrug amazing bird toast add" password "Password@1" name "recipient_0" custom derivation path "m/44'/134'/0'"
    And I wait for "1 seconds"
    Given I click on an element with class "account-management-dropdown"
    And I click on text "Add new account"
    Given I add an account with passphrase "attract squeeze option inflict dynamic end evoke love proof among random blanket table pumpkin general impose access toast undo extend fun employ agree dash" password "Password@1" name "genesis_70" custom derivation path "m/44'/134'/70'"
    And I wait for "1 seconds"
    And I go to page "wallet"
    And I wait for "1 seconds"

  Scenario: Send tokens
    Given I click on a button with exact text "Send"
    Then I should see send form details
    And "lisk_mainchain" should be selected in "Recipient application" dropdown
    And "Lisk" should be selected in "Token" dropdown
    Then button with text "Continue to summary" should be disabled
    When I type "10" in "amount"
    When I type "lsk9s5g8f7v6evazu2z6zo6oygzyz4skj7s64fst6" in "recipient"
    Then button with text "Continue to summary" should be enabled
    Given I click on a button with exact text "Continue to summary"
    Then I should see "Transaction Summary"
    And I should see "10 LSK"
    When I click on a button with exact text "Send"
    When I type "Password@1" in "password"
    And I click on a button with exact text "Confirm and Sign"
    And I wait for "1 seconds"
    Then I should see "Transaction submitted"
    Then I should see "Add address to bookmarks"
    Then I should see "You received tokens"
    Given I click on an element with testId "dialog-close-button"
    And I wait for "10 seconds"
    Then the first transaction row should contain latest transaction details
    When I click on an element with testId "events-tab"
