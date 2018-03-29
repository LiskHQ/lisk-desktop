Feature: Saved Accounts 
  Scenario: should save account locally, after page reload it should require passphrase to do the first transaction, and remember the passphrase for next transactions
    When I go to "/"
    Given I'm logged in as "genesis"
    When I wait 1 seconds
    And I refresh the page
    And I wait 2 seconds
    Then I should be logged in
    And I wait 0.5 seconds
    Then I go to "main/transactions"
    When I fill in "1" to "amount" field
    And I fill in "537318935439898807L" to "recipient" field
    And I click "send next button"
    And I should see empty "passphrase" field
    And I fill in passphrase of "genesis" to "passphrase" field
    And I click "first passphrase next"
    Then I click "send button"
    And I wait 1 seconds
    Then I should see text "Transaction is being processed and will be confirmed. It may take up to 15 minutes to be secured in the blockchain." in "result box message" element
    When I click "okay button"
    And I fill in "2" to "amount" field
    And I fill in "537318935439898807L" to "recipient" field
    And I click "send next button"
    And I click "send button"
    And I wait 1 seconds
    Then I should see text "Transaction is being processed and will be confirmed. It may take up to 15 minutes to be secured in the blockchain." in "result box message" element

  Scenario: should allow to save a second account, switch accounts, log in to last active account, and remove account
    Given I'm logged in as "genesis"
    When I click "saved accounts" in main menu
    And I click "add lisk id card"
    And I'm logged in as "empty account"
    And I click "saved accounts" in main menu
    Then I should see 2 instances of "saved account card"
    When I click "saved account card"
    And I wait 1 seconds
    Then I should be logged in as "genesis" account
    When I refresh the page
    And I wait 2 seconds
    Then I should be logged in as "genesis" account
    When I click "saved accounts" in main menu
    And I should see 2 instances of "saved account card"
    And I click "edit button"
    And I click "remove button"
    And I click "confirm button"
    And I click "edit button"
    Then I should see 1 instances of "saved account card"

  @advanced
  Scenario: should save accounts only once
    When I go to "/"
    And I fill in passphrase of "empty account" to "passphrase" field
    And I click "login button"
    Then I should be logged in as "empty account" account
    When I click "saved accounts" in main menu
    And I click "add lisk id card"
    And I fill in passphrase of "genesis" to "passphrase" field
    And I click "login button"
    And I click "saved accounts" in main menu
    Then I should see 2 instances of "saved account card"
    When I click "add lisk id card"
    And I fill in passphrase of "empty account" to "passphrase" field
    And I click "login button"
    When I click "saved accounts" in main menu
    Then I should see 2 instances of "saved account card"
    And I click "add lisk id card"
    And I fill in passphrase of "genesis" to "passphrase" field
    And I click "login button"
    And I click "saved accounts" in main menu
    Then I should see 2 instances of "saved account card"
