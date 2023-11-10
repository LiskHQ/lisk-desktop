Feature: Wallet
  Background: Add sender and recipient accounts
    Given I click on a button with text "CustomNode"
    And I wait for "1 seconds"
    Given I click on text "Add network"
    Then I should see "dialogAddNetwork" modal
    And button with text "Add network" should be disabled
    Given I type "local_service" in "name"
    And I type "http://127.0.0.1:9901" in "serviceUrl"
    And I type "ws://127.0.0.1:9901" in "wsServiceUrl"
    And I wait for "1 seconds"
    And I click on a button with text "Add network"
    Then I should see 'Custom network added "local_service"'
    And I wait for "1 seconds"
    Given I click on an element with testId "selected-menu-item"
    And I click on exact text "local_service"
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
    And I should see "lisk_mainchain" should be selected in "To application" dropdown
    And I should see "Lisk" should be selected in "Token" dropdown
    Then button with text "Continue to summary" should be disabled
    When I type "10" in "amount"
    When I type "lsk9s5g8f7v6evazu2z6zo6oygzyz4skj7s64fst6" in "recipient"
    Then button with text "Continue to summary" should be enabled
    Given I click on a button with exact text "Continue to summary"
    Then I should see "Transaction Summary"
    And I should see "10 LSK" in element with class "summary"
    When I click on an element with class "confirm-button"
    When I type "Password@1" in "password"
    And I click on a button with exact text "Confirm and Sign"
    And I wait for "1 seconds"
    Then I should see "Transaction submitted"
    Then I should see "Add address to bookmarks"
    Given I click on an element with testId "dialog-close-button"
    And I wait for "10 seconds"
    Then the first transaction row should contain latest transaction details
    When I click on an element with testId "events-tab"
    Then I should see event table details
    Given I click on an element with class "account-management-dropdown"
    And I click on text "Switch account"
    Given I select account "recipient_0" in switch account modal
    And I click on exact text "View all tokens"
    And I wait for "1 seconds"
    Then I should see token table details
    And token balance should be greater than 0

  Scenario: Filter transactions and events
    Given I click on an element with testId "events-tab"
    When I click on the first row of transaction events
    And I copy the first detail on the page
    Given I go back to the previous page
    And I wait for "1 seconds"
    And I click on an element with testId "events-tab"
    Given I click on a button with text "Filter"
    Then I should see event filter details
    When I fill in copied detail for "Block ID"
    And I click on a button with exact text "Apply filters"
    Then I should see event table details
